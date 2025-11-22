<script lang="ts">
	import { diagramStore } from '$lib/stores/diagram';
	import { exportToPNG, exportToSVG, exportToPDF } from '$lib/utils/export';
	import TemplatePanel from './TemplatePanel.svelte';

	export let previewElement: HTMLElement | null = null;

	let showTemplates = false;
	let showExportMenu = false;
	let isSaving = false;

	async function handleExport(format: 'png' | 'svg' | 'pdf') {
		if (!previewElement) {
			alert('No diagram to export');
			return;
		}

		try {
			const filename = `${$diagramStore.title.replace(/\s+/g, '-').toLowerCase()}.${format}`;

			switch (format) {
				case 'png':
					await exportToPNG(previewElement, filename);
					break;
				case 'svg':
					await exportToSVG(previewElement, filename);
					break;
				case 'pdf':
					await exportToPDF(previewElement, filename);
					break;
			}
			showExportMenu = false;
		} catch (error) {
			console.error('Export failed:', error);
			alert('Failed to export diagram');
		}
	}

	function handleSave() {
		isSaving = true;
		// Save to localStorage for now
		const diagrams = JSON.parse(localStorage.getItem('diagrams') || '[]');
		const newDiagram = {
			id: $diagramStore.id || Date.now().toString(),
			title: $diagramStore.title,
			code: $diagramStore.code,
			updatedAt: new Date().toISOString()
		};

		const existingIndex = diagrams.findIndex((d: any) => d.id === newDiagram.id);
		if (existingIndex >= 0) {
			diagrams[existingIndex] = newDiagram;
		} else {
			diagrams.push(newDiagram);
		}

		localStorage.setItem('diagrams', JSON.stringify(diagrams));
		diagramStore.update(state => ({ ...state, id: newDiagram.id }));

		setTimeout(() => {
			isSaving = false;
		}, 1000);
	}

	function handleShare() {
		const shareData = {
			title: $diagramStore.title,
			code: $diagramStore.code
		};
		const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
		const shareUrl = `${window.location.origin}?share=${encoded}`;

		navigator.clipboard.writeText(shareUrl).then(() => {
			alert('Share link copied to clipboard!');
		}).catch(() => {
			prompt('Copy this link:', shareUrl);
		});
	}
</script>

<div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
				<path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
			</svg>
			<input
				type="text"
				bind:value={$diagramStore.title}
				class="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
				placeholder="Diagram Title"
			/>
		</div>
	</div>

	<div class="flex items-center space-x-2">
		<a
			href="/my-diagrams"
			class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
		>
			<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
			</svg>
			My Diagrams
		</a>

		<button
			on:click={() => showTemplates = !showTemplates}
			class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
		>
			<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
			</svg>
			Templates
		</button>

		<button
			on:click={handleSave}
			disabled={isSaving}
			class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
		>
			<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
			</svg>
			{isSaving ? 'Saving...' : 'Save'}
		</button>

		<button
			on:click={handleShare}
			class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
		>
			<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
			</svg>
			Share
		</button>

		<div class="relative">
			<button
				on:click={() => showExportMenu = !showExportMenu}
				class="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-secondary"
			>
				<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
				</svg>
				Export
			</button>

			{#if showExportMenu}
				<div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
					<div class="py-1">
						<button
							on:click={() => handleExport('png')}
							class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						>
							Export as PNG
						</button>
						<button
							on:click={() => handleExport('svg')}
							class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						>
							Export as SVG
						</button>
						<button
							on:click={() => handleExport('pdf')}
							class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						>
							Export as PDF
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<TemplatePanel bind:show={showTemplates} />

<style>
	/* Click outside to close menus */
	:global(body) {
		overflow-x: hidden;
	}
</style>
