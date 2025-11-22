import { get } from 'svelte/store';
import { diagramStore } from '$lib/stores/diagram';
import type { Unsubscriber } from 'svelte/store';

/**
 * 自动保存配置选项
 */
export interface AutoSaveOptions {
	/** 自动保存延迟时间（毫秒），默认 2000ms */
	delay?: number;
	/** 是否启用自动保存，默认 true */
	enabled?: boolean;
}

/**
 * 自动保存实例接口
 */
export interface AutoSaveInstance {
	/** 立即保存，不等待延迟 */
	saveNow: () => void;
	/** 暂停自动保存（可恢复） */
	pause: () => void;
	/** 恢复自动保存 */
	resume: () => void;
	/** 启用自动保存 */
	enable: () => void;
	/** 禁用自动保存 */
	disable: () => void;
	/** 销毁实例，清理所有资源 */
	destroy: () => void;
}

/**
 * 创建自动保存实例
 *
 * @param options 配置选项
 * @returns 自动保存实例
 *
 * @example
 * ```ts
 * const autoSave = createAutoSave({ delay: 3000 });
 *
 * // 手动保存
 * autoSave.saveNow();
 *
 * // 暂停自动保存
 * autoSave.pause();
 *
 * // 恢复自动保存
 * autoSave.resume();
 *
 * // 清理资源
 * autoSave.destroy();
 * ```
 */
export function createAutoSave(options: AutoSaveOptions = {}): AutoSaveInstance {
	const { delay = 2000, enabled = true } = options;

	// 状态管理
	let isEnabled = enabled;
	let isPaused = false;
	let timeoutId: NodeJS.Timeout | null = null;
	let unsubscribe: Unsubscriber | null = null;
	let isFirstCall = true; // 跳过订阅时的初始触发

	/**
	 * 清除定时器
	 */
	function clearTimer() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	/**
	 * 取消订阅
	 */
	function unsubscribeStore() {
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}
	}

	/**
	 * 订阅 store 变化
	 */
	function subscribeStore() {
		if (!unsubscribe) {
			unsubscribe = diagramStore.subscribe(() => {
				scheduleAutoSave();
			});
		}
	}

	/**
	 * 保存图表到 localStorage
	 */
	function saveDiagram() {
		const state = get(diagramStore);

		// 获取现有图表列表
		const existingDiagrams = JSON.parse(localStorage.getItem('diagrams') || '[]');

		// 创建图表对象
		const diagram = {
			id: state.id || Date.now().toString(),
			title: state.title,
			code: state.code,
			updatedAt: new Date().toISOString()
		};

		// 更新或添加图表
		if (state.id) {
			const index = existingDiagrams.findIndex((d: any) => d.id === state.id);
			if (index >= 0) {
				// 更新现有图表
				existingDiagrams[index] = diagram;
			} else {
				// ID 存在但未找到，添加新图表
				existingDiagrams.push(diagram);
			}
		} else {
			// 无 ID，添加新图表并更新 store
			existingDiagrams.push(diagram);
			diagramStore.update(s => ({ ...s, id: diagram.id }));
		}

		// 保存到 localStorage
		localStorage.setItem('diagrams', JSON.stringify(existingDiagrams));
	}

	/**
	 * 调度自动保存（防抖）
	 */
	function scheduleAutoSave() {
		// 跳过第一次调用（订阅时的初始触发）
		if (isFirstCall) {
			isFirstCall = false;
			return;
		}

		// 检查是否允许保存
		if (!isEnabled || isPaused) {
			return;
		}

		// 清除之前的定时器（实现防抖）
		clearTimer();

		// 设置新的定时器
		timeoutId = setTimeout(() => {
			saveDiagram();
			timeoutId = null;
		}, delay);
	}

	// 初始化：如果启用，则订阅 store
	if (isEnabled) {
		subscribeStore();
	}

	// 返回公共 API
	return {
		saveNow() {
			clearTimer();
			saveDiagram();
		},

		pause() {
			isPaused = true;
			clearTimer();
		},

		resume() {
			isPaused = false;
			scheduleAutoSave();
		},

		enable() {
			if (!isEnabled) {
				isEnabled = true;
				isFirstCall = true;
				subscribeStore();
			}
		},

		disable() {
			isEnabled = false;
			clearTimer();
			unsubscribeStore();
		},

		destroy() {
			clearTimer();
			unsubscribeStore();
		}
	};
}
