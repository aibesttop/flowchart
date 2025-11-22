<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { diagramStore } from '$lib/stores/diagram';

	interface SavedDiagram {
		id: string;
		title: string;
		code: string;
		updatedAt: string;
	}

	let diagrams: SavedDiagram[] = [];
	let searchQuery = '';

	$: filteredDiagrams = diagrams.filter(d =>
		d.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	onMount(() => {
		loadDiagrams();
	});

	function loadDiagrams() {
		const saved = localStorage.getItem('diagrams');
		if (saved) {
			diagrams = JSON.parse(saved).sort((a: SavedDiagram, b: SavedDiagram) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			);
		}
	}

	function openDiagram(diagram: SavedDiagram) {
		diagramStore.set({
			id: diagram.id,
			title: diagram.title,
			code: diagram.code
		});
		goto('/');
	}

	function deleteDiagram(id: string) {
		if (!confirm('Are you sure you want to delete this diagram?')) return;

		diagrams = diagrams.filter(d => d.id !== id);
		localStorage.setItem('diagrams', JSON.stringify(diagrams));
	}

	function createNew() {
		diagramStore.set({
			code: 'graph TD\n    A[Start] --> B[End]',
			title: 'Untitled Diagram'
		});
		goto('/');
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}
</script>

<svelte:head>
	<title>My Diagrams - Mermaid Chart</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="flex items-center space-x-2">
					<svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
						<path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
					</svg>
					<span class="text-xl font-bold">Mermaid Chart</span>
				</a>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">My Diagrams</h1>
			<p class="text-gray-600">Manage all your saved diagrams</p>
		</div>

		<div class="mb-6 flex items-center justify-between">
			<div class="flex-1 max-w-md">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search diagrams..."
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<button
				on:click={createNew}
				class="ml-4 px-6 py-2 text-white bg-primary rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
			>
				<svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				New Diagram
			</button>
		</div>

		{#if filteredDiagrams.length === 0}
			<div class="text-center py-12">
				<svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-700 mb-2">No diagrams found</h3>
				<p class="text-gray-500 mb-4">
					{searchQuery ? 'Try a different search term' : 'Create your first diagram to get started'}
				</p>
				{#if !searchQuery}
					<button
						on:click={createNew}
						class="px-6 py-2 text-white bg-primary rounded-md hover:bg-blue-600"
					>
						Create New Diagram
					</button>
				{/if}
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredDiagrams as diagram}
					<div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
						<div class="p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">{diagram.title}</h3>
							<p class="text-sm text-gray-500 mb-4">Updated {formatDate(diagram.updatedAt)}</p>
							<pre class="text-xs bg-gray-50 p-3 rounded overflow-hidden max-h-32"><code>{diagram.code}</code></pre>
						</div>
						<div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
							<button
								on:click={() => openDiagram(diagram)}
								class="text-primary hover:text-blue-600 font-medium text-sm"
							>
								Open
							</button>
							<button
								on:click={() => deleteDiagram(diagram.id)}
								class="text-red-600 hover:text-red-700 font-medium text-sm"
							>
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
