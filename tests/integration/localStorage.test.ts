import { describe, it, expect, beforeEach } from 'vitest';

describe('LocalStorage Integration', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should save and retrieve diagrams', () => {
		const diagram = {
			id: '123',
			title: 'Test Diagram',
			code: 'graph TD\n    A --> B',
			updatedAt: new Date().toISOString()
		};

		localStorage.setItem('diagrams', JSON.stringify([diagram]));

		const retrieved = localStorage.getItem('diagrams');
		expect(retrieved).toBeTruthy();

		const parsed = JSON.parse(retrieved!);
		expect(parsed).toHaveLength(1);
		expect(parsed[0]).toEqual(diagram);
	});

	it('should handle multiple diagrams', () => {
		const diagrams = [
			{ id: '1', title: 'D1', code: 'graph TD\n    A1', updatedAt: new Date().toISOString() },
			{ id: '2', title: 'D2', code: 'graph TD\n    A2', updatedAt: new Date().toISOString() },
			{ id: '3', title: 'D3', code: 'graph TD\n    A3', updatedAt: new Date().toISOString() }
		];

		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		const retrieved = JSON.parse(localStorage.getItem('diagrams')!);
		expect(retrieved).toHaveLength(3);
	});

	it('should update existing diagram', () => {
		const diagrams = [
			{ id: '1', title: 'Original', code: 'graph TD\n    A', updatedAt: new Date().toISOString() }
		];

		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		// Update
		diagrams[0].title = 'Updated';
		diagrams[0].updatedAt = new Date().toISOString();
		localStorage.setItem('diagrams', JSON.stringify(diagrams));

		const retrieved = JSON.parse(localStorage.getItem('diagrams')!);
		expect(retrieved[0].title).toBe('Updated');
	});

	it('should handle empty state', () => {
		const retrieved = localStorage.getItem('diagrams');
		expect(retrieved).toBeNull();

		const diagrams = JSON.parse(retrieved || '[]');
		expect(diagrams).toEqual([]);
	});

	it('should persist across operations', () => {
		localStorage.setItem('diagrams', JSON.stringify([{ id: '1', title: 'Test' }]));

		expect(localStorage.getItem('diagrams')).toBeTruthy();

		localStorage.setItem('otherKey', 'value');

		expect(localStorage.getItem('diagrams')).toBeTruthy();
	});
});
