<script lang="ts">
	import { onMount } from 'svelte';
	import { diagramStore } from '$lib/stores/diagram';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import DiagramPreview from '$lib/components/DiagramPreview.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';

	let previewElement: HTMLElement | null = null;
	let editorWidth = 50; // percentage
	let isResizing = false;

	function handleRenderComplete(element: HTMLElement) {
		previewElement = element;
	}

	function startResize() {
		isResizing = true;
	}

	function handleResize(e: MouseEvent) {
		if (!isResizing) return;
		const newWidth = (e.clientX / window.innerWidth) * 100;
		if (newWidth >= 20 && newWidth <= 80) {
			editorWidth = newWidth;
		}
	}

	function stopResize() {
		isResizing = false;
	}

	onMount(() => {
		// Load from share link if present
		const params = new URLSearchParams(window.location.search);
		const shareData = params.get('share');

		if (shareData) {
			try {
				const decoded = JSON.parse(decodeURIComponent(atob(shareData)));
				diagramStore.set({
					code: decoded.code,
					title: decoded.title
				});
			} catch (error) {
				console.error('Failed to load shared diagram:', error);
			}
		}

		// Add global resize handlers
		window.addEventListener('mousemove', handleResize);
		window.addEventListener('mouseup', stopResize);

		return () => {
			window.removeEventListener('mousemove', handleResize);
			window.removeEventListener('mouseup', stopResize);
		};
	});
</script>

<svelte:head>
	<title>{$diagramStore.title} - Mermaid Chart</title>
</svelte:head>

<div class="h-screen flex flex-col overflow-hidden">
	<Toolbar {previewElement} />

	<div class="flex-1 flex overflow-hidden">
		<!-- Editor Panel -->
		<div
			class="flex flex-col border-r border-gray-200 bg-gray-50"
			style="width: {editorWidth}%;"
		>
			<div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
				<h3 class="text-sm font-semibold text-gray-700">Code Editor</h3>
			</div>
			<div class="flex-1 overflow-hidden">
				<CodeEditor />
			</div>
		</div>

		<!-- Resizer -->
		<button
			class="w-1 bg-gray-200 hover:bg-primary cursor-col-resize transition-colors"
			on:mousedown={startResize}
			aria-label="Resize panels"
		></button>

		<!-- Preview Panel -->
		<div class="flex-1 flex flex-col overflow-hidden bg-gray-50">
			<div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
				<h3 class="text-sm font-semibold text-gray-700">Preview</h3>
			</div>
			<div class="flex-1 overflow-auto">
				<DiagramPreview onRenderComplete={handleRenderComplete} />
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
