import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { createAutoSave } from '$lib/utils/autoSave';
import { diagramStore } from '$lib/stores/diagram';

describe('AutoSave (TDD)', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		localStorage.clear();
		vi.mocked(localStorage.setItem).mockClear();
		vi.mocked(localStorage.getItem).mockClear();
		diagramStore.set({
			code: 'graph TD\n    A --> B',
			title: 'Test Diagram'
		});
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.restoreAllMocks();
	});

	describe('基本功能', () => {
		it('应该在指定延迟后自动保存图表', async () => {
			const autoSave = createAutoSave({ delay: 2000 });

			// 更新图表
			diagramStore.update(state => ({ ...state, code: 'graph LR\n    X --> Y' }));

			// 还没到时间，不应该保存
			vi.advanceTimersByTime(1000);
			expect(localStorage.setItem).not.toHaveBeenCalled();

			// 时间到了，应该自动保存
			vi.advanceTimersByTime(1000);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'diagrams',
				expect.any(String)
			);

			autoSave.destroy();
		});

		it('应该在用户快速输入时防抖（debounce）', () => {
			const autoSave = createAutoSave({ delay: 1000 });

			// 快速连续更新
			diagramStore.update(state => ({ ...state, code: 'A' }));
			vi.advanceTimersByTime(500);

			diagramStore.update(state => ({ ...state, code: 'AB' }));
			vi.advanceTimersByTime(500);

			diagramStore.update(state => ({ ...state, code: 'ABC' }));

			// 应该只调用一次保存
			vi.advanceTimersByTime(1000);
			expect(localStorage.setItem).toHaveBeenCalledTimes(1);

			autoSave.destroy();
		});

		it('应该可以手动触发保存', () => {
			const autoSave = createAutoSave({ delay: 5000 });

			diagramStore.update(state => ({ ...state, code: 'graph LR\n    A --> B' }));

			// 手动保存，不等待延迟
			autoSave.saveNow();

			expect(localStorage.setItem).toHaveBeenCalled();

			autoSave.destroy();
		});

		it('应该可以暂停和恢复自动保存', () => {
			const autoSave = createAutoSave({ delay: 1000 });

			// 暂停自动保存
			autoSave.pause();

			diagramStore.update(state => ({ ...state, code: 'paused' }));
			vi.advanceTimersByTime(2000);

			// 暂停时不应该保存
			expect(localStorage.setItem).not.toHaveBeenCalled();

			// 恢复自动保存
			autoSave.resume();

			diagramStore.update(state => ({ ...state, code: 'resumed' }));
			vi.advanceTimersByTime(1000);

			// 恢复后应该保存
			expect(localStorage.setItem).toHaveBeenCalled();

			autoSave.destroy();
		});

		it('应该在销毁时清理资源', () => {
			const autoSave = createAutoSave({ delay: 1000 });

			// 清除之前的mock调用
			vi.mocked(localStorage.setItem).mockClear();

			diagramStore.update(state => ({ ...state, code: 'before destroy' }));

			autoSave.destroy();

			// 销毁后不应该再保存
			vi.advanceTimersByTime(2000);
			expect(localStorage.setItem).not.toHaveBeenCalled();
		});
	});

	describe('配置选项', () => {
		it('应该支持自定义延迟时间', () => {
			const autoSave = createAutoSave({ delay: 3000 });

			diagramStore.update(state => ({ ...state, code: 'custom delay' }));

			vi.advanceTimersByTime(2000);
			expect(localStorage.setItem).not.toHaveBeenCalled();

			vi.advanceTimersByTime(1000);
			expect(localStorage.setItem).toHaveBeenCalled();

			autoSave.destroy();
		});

		it('应该支持禁用自动保存', () => {
			const autoSave = createAutoSave({ enabled: false, delay: 1000 });

			diagramStore.update(state => ({ ...state, code: 'disabled' }));
			vi.advanceTimersByTime(2000);

			expect(localStorage.setItem).not.toHaveBeenCalled();

			autoSave.destroy();
		});

		it('应该可以动态启用/禁用', () => {
			const autoSave = createAutoSave({ delay: 1000 });

			// 禁用
			autoSave.disable();

			// 清除之前的mock调用
			vi.mocked(localStorage.setItem).mockClear();

			diagramStore.update(state => ({ ...state, code: 'when disabled' }));
			vi.advanceTimersByTime(2000);
			expect(localStorage.setItem).not.toHaveBeenCalled();

			// 启用
			autoSave.enable();
			diagramStore.update(state => ({ ...state, code: 'when enabled' }));
			vi.advanceTimersByTime(1000);
			expect(localStorage.setItem).toHaveBeenCalled();

			autoSave.destroy();
		});
	});

	describe('数据保存', () => {
		it('应该保存完整的图表数据', () => {
			const autoSave = createAutoSave({ delay: 1000 });

			const testData = {
				code: 'graph TD\n    Test --> Data',
				title: 'Auto-saved Diagram',
				id: '123'
			};

			diagramStore.set(testData);
			vi.advanceTimersByTime(1000);

			const savedCall = vi.mocked(localStorage.setItem).mock.calls[0];
			const savedData = JSON.parse(savedCall[1]);

			expect(savedData).toHaveLength(1);
			expect(savedData[0]).toMatchObject({
				code: testData.code,
				title: testData.title
			});

			autoSave.destroy();
		});

		it('应该更新现有图表而不是创建新的', () => {
			// 先保存一个图表
			const existingDiagram = {
				id: 'existing-id',
				title: 'Original',
				code: 'original code',
				updatedAt: new Date().toISOString()
			};
			localStorage.setItem('diagrams', JSON.stringify([existingDiagram]));

			// 清除之前的 mock 调用记录
			vi.mocked(localStorage.setItem).mockClear();

			const autoSave = createAutoSave({ delay: 1000 });

			// 更新现有图表
			diagramStore.set({
				id: 'existing-id',
				title: 'Updated',
				code: 'updated code'
			});

			vi.advanceTimersByTime(1000);

			// 检查最后一次调用
			const calls = vi.mocked(localStorage.setItem).mock.calls;
			const savedCall = calls[calls.length - 1];
			const savedData = JSON.parse(savedCall[1]);

			// 应该只有一个图表（更新而不是新增）
			expect(savedData).toHaveLength(1);
			expect(savedData[0].title).toBe('Updated');
			expect(savedData[0].code).toBe('updated code');

			autoSave.destroy();
		});
	});
});
