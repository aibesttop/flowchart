import { describe, it, expect } from 'vitest';
import { templates } from '$lib/stores/templates';

describe('templates', () => {
	it('should have at least 8 templates', () => {
		expect(templates.length).toBeGreaterThanOrEqual(8);
	});

	it('should have flowchart template', () => {
		const flowchart = templates.find(t => t.category === 'Flowchart');
		expect(flowchart).toBeDefined();
		expect(flowchart?.code).toContain('graph');
	});

	it('should have sequence diagram template', () => {
		const sequence = templates.find(t => t.category === 'Sequence');
		expect(sequence).toBeDefined();
		expect(sequence?.code).toContain('sequenceDiagram');
	});

	it('should have class diagram template', () => {
		const classDiagram = templates.find(t => t.category === 'Class');
		expect(classDiagram).toBeDefined();
		expect(classDiagram?.code).toContain('classDiagram');
	});

	it('should have state diagram template', () => {
		const state = templates.find(t => t.category === 'State');
		expect(state).toBeDefined();
		expect(state?.code).toContain('stateDiagram');
	});

	it('should have ER diagram template', () => {
		const er = templates.find(t => t.category === 'ER');
		expect(er).toBeDefined();
		expect(er?.code).toContain('erDiagram');
	});

	it('should have gantt chart template', () => {
		const gantt = templates.find(t => t.category === 'Gantt');
		expect(gantt).toBeDefined();
		expect(gantt?.code).toContain('gantt');
	});

	it('should have pie chart template', () => {
		const pie = templates.find(t => t.category === 'Pie');
		expect(pie).toBeDefined();
		expect(pie?.code).toContain('pie');
	});

	it('should have user journey template', () => {
		const journey = templates.find(t => t.category === 'Journey');
		expect(journey).toBeDefined();
		expect(journey?.code).toContain('journey');
	});

	it('each template should have required properties', () => {
		templates.forEach(template => {
			expect(template).toHaveProperty('id');
			expect(template).toHaveProperty('name');
			expect(template).toHaveProperty('description');
			expect(template).toHaveProperty('code');
			expect(template).toHaveProperty('category');

			expect(template.id).toBeTruthy();
			expect(template.name).toBeTruthy();
			expect(template.description).toBeTruthy();
			expect(template.code).toBeTruthy();
			expect(template.category).toBeTruthy();
		});
	});

	it('all template ids should be unique', () => {
		const ids = templates.map(t => t.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it('templates should have valid mermaid syntax', () => {
		const validStarters = [
			'graph',
			'sequenceDiagram',
			'classDiagram',
			'stateDiagram',
			'erDiagram',
			'gantt',
			'pie',
			'journey'
		];

		templates.forEach(template => {
			const hasValidStarter = validStarters.some(starter =>
				template.code.trim().startsWith(starter)
			);
			expect(hasValidStarter).toBe(true);
		});
	});
});
