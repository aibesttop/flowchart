<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { diagramStore } from '$lib/stores/diagram';
	import type * as Monaco from 'monaco-editor';

	let editorContainer: HTMLDivElement;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;

	onMount(async () => {
		// Dynamically import Monaco to avoid SSR issues
		monaco = await import('monaco-editor');

		// Configure Monaco
		monaco.languages.register({ id: 'mermaid' });
		monaco.languages.setMonarchTokensProvider('mermaid', {
			tokenizer: {
				root: [
					[/graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey/, 'keyword'],
					[/-->|---|\||o\{|\}o/, 'operator'],
					[/\[.*?\]/, 'string'],
					[/\{.*?\}/, 'string'],
					[/\(.*?\)/, 'string']
				]
			}
		});

		// Create editor instance
		editor = monaco.editor.create(editorContainer, {
			value: $diagramStore.code,
			language: 'mermaid',
			theme: 'vs-light',
			automaticLayout: true,
			fontSize: 14,
			lineNumbers: 'on',
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			wordWrap: 'on',
			wrappingIndent: 'indent'
		});

		// Update store when editor content changes
		editor.onDidChangeModelContent(() => {
			const value = editor.getValue();
			diagramStore.update(state => ({ ...state, code: value }));
		});

		// Update editor when store changes (for template selection)
		const unsubscribe = diagramStore.subscribe(state => {
			if (editor && editor.getValue() !== state.code) {
				editor.setValue(state.code);
			}
		});

		onDestroy(() => {
			unsubscribe();
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.dispose();
		}
	});
</script>

<div class="h-full w-full" bind:this={editorContainer}></div>
