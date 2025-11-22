import { writable } from 'svelte/store';

export interface DiagramState {
	code: string;
	title: string;
	id?: string;
}

const defaultCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

export const diagramStore = writable<DiagramState>({
	code: defaultCode,
	title: 'Untitled Diagram'
});

export const errorStore = writable<string | null>(null);
