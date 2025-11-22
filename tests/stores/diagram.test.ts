import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { diagramStore, errorStore } from '$lib/stores/diagram';

describe('diagramStore', () => {
	beforeEach(() => {
		// Reset store to default state
		diagramStore.set({
			code: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
			title: 'Untitled Diagram'
		});
	});

	it('should initialize with default values', () => {
		const state = get(diagramStore);
		expect(state.title).toBe('Untitled Diagram');
		expect(state.code).toContain('graph TD');
		expect(state.code).toContain('A[Start]');
	});

	it('should update diagram code', () => {
		const newCode = 'graph LR\n    A --> B';
		diagramStore.update(state => ({ ...state, code: newCode }));

		const state = get(diagramStore);
		expect(state.code).toBe(newCode);
	});

	it('should update diagram title', () => {
		const newTitle = 'My Flowchart';
		diagramStore.update(state => ({ ...state, title: newTitle }));

		const state = get(diagramStore);
		expect(state.title).toBe(newTitle);
	});

	it('should set diagram id', () => {
		const id = '12345';
		diagramStore.update(state => ({ ...state, id }));

		const state = get(diagramStore);
		expect(state.id).toBe(id);
	});

	it('should allow complete state replacement', () => {
		const newState = {
			code: 'sequenceDiagram\n    Alice->>Bob: Hello',
			title: 'Sequence Diagram',
			id: 'seq-001'
		};
		diagramStore.set(newState);

		const state = get(diagramStore);
		expect(state).toEqual(newState);
	});
});

describe('errorStore', () => {
	beforeEach(() => {
		errorStore.set(null);
	});

	it('should initialize with null', () => {
		const error = get(errorStore);
		expect(error).toBeNull();
	});

	it('should store error message', () => {
		const errorMessage = 'Syntax error on line 3';
		errorStore.set(errorMessage);

		const error = get(errorStore);
		expect(error).toBe(errorMessage);
	});

	it('should clear error', () => {
		errorStore.set('Some error');
		errorStore.set(null);

		const error = get(errorStore);
		expect(error).toBeNull();
	});
});
