<script lang="ts">
	import { templates } from '$lib/stores/templates';
	import { diagramStore } from '$lib/stores/diagram';

	export let show = false;

	function selectTemplate(template: typeof templates[0]) {
		diagramStore.update(state => ({
			...state,
			code: template.code,
			title: template.name
		}));
		show = false;
	}

	// Group templates by category
	$: categories = templates.reduce((acc, template) => {
		if (!acc[template.category]) {
			acc[template.category] = [];
		}
		acc[template.category].push(template);
		return acc;
	}, {} as Record<string, typeof templates>);
</script>

{#if show}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
			<div class="p-6 border-b border-gray-200 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Choose a Template</h2>
				<button
					on:click={() => show = false}
					class="text-gray-400 hover:text-gray-600"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<div class="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
				{#each Object.entries(categories) as [category, temps]}
					<div class="mb-8">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each temps as template}
								<button
									on:click={() => selectTemplate(template)}
									class="text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
								>
									<h4 class="font-semibold text-gray-900 mb-2">{template.name}</h4>
									<p class="text-sm text-gray-600 mb-3">{template.description}</p>
									<pre class="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto"><code>{template.code}</code></pre>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
