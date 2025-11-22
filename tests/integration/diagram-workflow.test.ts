import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { diagramStore } from '$lib/stores/diagram';
import { templates } from '$lib/stores/templates';

describe('Diagram Workflow Integration', () => {
	beforeEach(() => {
		// Reset store
		diagramStore.set({
			code: 'graph TD\n    A --> B',
			title: 'Untitled Diagram'
		});

		// Clear localStorage
		localStorage.clear();
		vi.clearAllMocks();
	});

	it('should complete full diagram creation workflow', () => {
		// 1. Start with default diagram
		let state = get(diagramStore);
		expect(state.title).toBe('Untitled Diagram');

		// 2. Select a template
		const flowchartTemplate = templates.find(t => t.category === 'Flowchart');
		expect(flowchartTemplate).toBeDefined();

		diagramStore.set({
			code: flowchartTemplate!.code,
			title: flowchartTemplate!.name
		});

		state = get(diagramStore);
		expect(state.code).toBe(flowchartTemplate!.code);
		expect(state.title).toBe(flowchartTemplate!.name);

		// 3. Edit the diagram
		const customCode = 'graph LR\n    Start --> End';
		diagramStore.update(s => ({ ...s, code: customCode }));

		state = get(diagramStore);
		expect(state.code).toBe(customCode);

		// 4. Update title
		diagramStore.update(s => ({ ...s, title: 'My Custom Flowchart' }));

		state = get(diagramStore);
		expect(state.title).toBe('My Custom Flowchart');

		// 5. Save diagram
		const id = Date.now().toString();
		const savedDiagram = {
			id,
			title: state.title,
			code: state.code,
			updatedAt: new Date().toISOString()
		};

		localStorage.setItem('diagrams', JSON.stringify([savedDiagram]));
		diagramStore.update(s => ({ ...s, id }));

		// 6. Verify save
		const saved = localStorage.getItem('diagrams');
		expect(saved).toBeTruthy();
		const diagrams = JSON.parse(saved!);
		expect(diagrams).toHaveLength(1);
		expect(diagrams[0].title).toBe('My Custom Flowchart');
		expect(diagrams[0].code).toBe(customCode);
	});

	it('should handle multiple diagram saves and updates', () => {
		const diagrams = [
			{
				id: '1',
				title: 'Diagram 1',
				code: 'graph TD\n    A --> B',
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Diagram 2',
				code: 'sequenceDiagram\n    A->>B: Hello',
				updatedAt: new Date().toISOString()
			}
		];

		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		// Load first diagram
		diagramStore.set({
			id: diagrams[0].id,
			title: diagrams[0].title,
			code: diagrams[0].code
		});

		let state = get(diagramStore);
		expect(state.id).toBe('1');
		expect(state.title).toBe('Diagram 1');

		// Update and save
		diagramStore.update(s => ({ ...s, title: 'Updated Diagram 1' }));

		const updatedDiagram = {
			...diagrams[0],
			title: 'Updated Diagram 1',
			updatedAt: new Date().toISOString()
		};

		diagrams[0] = updatedDiagram;
		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		// Verify update
		const saved = JSON.parse(localStorage.getItem('diagrams')!);
		expect(saved[0].title).toBe('Updated Diagram 1');
		expect(saved).toHaveLength(2);
	});

	it('should handle share link generation and loading', () => {
		const diagram = {
			title: 'Shared Diagram',
			code: 'graph TD\n    Share --> This'
		};

		diagramStore.set(diagram);

		// Generate share data
		const shareData = btoa(encodeURIComponent(JSON.stringify(diagram)));
		expect(shareData).toBeTruthy();

		// Simulate loading from share link
		const decoded = JSON.parse(decodeURIComponent(atob(shareData)));
		expect(decoded.title).toBe(diagram.title);
		expect(decoded.code).toBe(diagram.code);

		// Load into store
		diagramStore.set(decoded);

		const state = get(diagramStore);
		expect(state.title).toBe('Shared Diagram');
		expect(state.code).toBe('graph TD\n    Share --> This');
	});

	it('should handle diagram template switching', () => {
		// Start with flowchart
		const flowchart = templates.find(t => t.category === 'Flowchart');
		diagramStore.set({
			code: flowchart!.code,
			title: flowchart!.name
		});

		let state = get(diagramStore);
		expect(state.code).toContain('graph');

		// Switch to sequence diagram
		const sequence = templates.find(t => t.category === 'Sequence');
		diagramStore.set({
			code: sequence!.code,
			title: sequence!.name
		});

		state = get(diagramStore);
		expect(state.code).toContain('sequenceDiagram');

		// Switch to gantt chart
		const gantt = templates.find(t => t.category === 'Gantt');
		diagramStore.set({
			code: gantt!.code,
			title: gantt!.name
		});

		state = get(diagramStore);
		expect(state.code).toContain('gantt');
	});

	it('should handle delete operations', () => {
		const diagrams = [
			{
				id: '1',
				title: 'Diagram 1',
				code: 'graph TD\n    A --> B',
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Diagram 2',
				code: 'graph TD\n    C --> D',
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Diagram 3',
				code: 'graph TD\n    E --> F',
				updatedAt: new Date().toISOString()
			}
		];

		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		// Delete diagram 2
		const filtered = diagrams.filter(d => d.id !== '2');
		localStorage.setItem('diagrams', JSON.stringify(filtered));

		const saved = JSON.parse(localStorage.getItem('diagrams')!);
		expect(saved).toHaveLength(2);
		expect(saved.find((d: any) => d.id === '2')).toBeUndefined();
		expect(saved.find((d: any) => d.id === '1')).toBeDefined();
		expect(saved.find((d: any) => d.id === '3')).toBeDefined();
	});
});
