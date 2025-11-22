<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { diagramStore, errorStore } from '$lib/stores/diagram';
	import type mermaidAPI from 'mermaid';

	let previewContainer: HTMLDivElement;
	let mermaid: typeof mermaidAPI;
	let renderTimeout: NodeJS.Timeout;

	export let onRenderComplete: ((element: HTMLElement) => void) | undefined = undefined;

	async function renderDiagram(code: string) {
		if (!mermaid || !previewContainer) return;

		try {
			// Clear previous diagram
			previewContainer.innerHTML = '';
			errorStore.set(null);

			// Generate unique ID for this render
			const id = `mermaid-${Date.now()}`;

			// Render diagram
			const { svg } = await mermaid.render(id, code);
			previewContainer.innerHTML = svg;

			// Notify parent component
			if (onRenderComplete) {
				onRenderComplete(previewContainer);
			}
		} catch (error: any) {
			console.error('Mermaid rendering error:', error);
			errorStore.set(error.message || 'Failed to render diagram');
			previewContainer.innerHTML = `
				<div class="flex items-center justify-center h-full text-red-600">
					<div class="text-center p-8">
						<svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<h3 class="text-lg font-semibold mb-2">Syntax Error</h3>
						<p class="text-sm">${error.message || 'Failed to render diagram'}</p>
					</div>
				</div>
			`;
		}
	}

	function debouncedRender(code: string) {
		if (renderTimeout) {
			clearTimeout(renderTimeout);
		}
		renderTimeout = setTimeout(() => renderDiagram(code), 500);
	}

	onMount(async () => {
		// Dynamically import mermaid to avoid SSR issues
		const mermaidModule = await import('mermaid');
		mermaid = mermaidModule.default;

		// Initialize mermaid
		mermaid.initialize({
			startOnLoad: false,
			theme: 'default',
			securityLevel: 'loose',
			fontFamily: 'Arial, sans-serif'
		});

		// Initial render
		renderDiagram($diagramStore.code);

		// Subscribe to diagram changes
		const unsubscribe = diagramStore.subscribe(state => {
			debouncedRender(state.code);
		});

		onDestroy(() => {
			unsubscribe();
			if (renderTimeout) {
				clearTimeout(renderTimeout);
			}
		});
	});
</script>

<div class="mermaid-container h-full w-full bg-white" bind:this={previewContainer}>
	<div class="flex items-center justify-center h-full text-gray-400">
		<div class="text-center">
			<svg class="w-16 h-16 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
			</svg>
			<p>Loading diagram...</p>
		</div>
	</div>
</div>
