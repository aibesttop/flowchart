import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TemplatePanel from '$lib/components/TemplatePanel.svelte';
import { get } from 'svelte/store';
import { diagramStore } from '$lib/stores/diagram';

describe('TemplatePanel', () => {
	beforeEach(() => {
		diagramStore.set({
			code: 'graph TD\n    A --> B',
			title: 'Test Diagram'
		});
	});

	it('should render when show is true', () => {
		const { container } = render(TemplatePanel, { props: { show: true } });
		expect(container.querySelector('h2')?.textContent).toContain('Choose a Template');
	});

	it('should not render when show is false', () => {
		const { container } = render(TemplatePanel, { props: { show: false } });
		expect(container.querySelector('h2')).toBeNull();
	});

	it('should display all template categories', () => {
		const { container } = render(TemplatePanel, { props: { show: true } });

		const categories = ['Flowchart', 'Sequence', 'Class', 'State', 'ER', 'Gantt', 'Pie', 'Journey'];
		categories.forEach(category => {
			expect(container.textContent).toContain(category);
		});
	});

	it('should have clickable template buttons', async () => {
		const { container } = render(TemplatePanel, { props: { show: true } });

		// Find template buttons
		const templateButtons = container.querySelectorAll('button');
		expect(templateButtons.length).toBeGreaterThan(1); // At least one close button + templates
	});

	it('should render close button', async () => {
		const { container } = render(TemplatePanel, { props: { show: true } });

		// Find close button (SVG with X path)
		const closeButton = Array.from(container.querySelectorAll('button')).find(
			btn => btn.querySelector('svg path[d*="M6 18L18 6"]')
		);

		expect(closeButton).toBeTruthy();
	});

	it('should display template code preview', () => {
		const { container } = render(TemplatePanel, { props: { show: true } });

		// Check for code preview
		const codeElements = container.querySelectorAll('pre code');
		expect(codeElements.length).toBeGreaterThan(0);
	});

	it('should show template descriptions', () => {
		const { container } = render(TemplatePanel, { props: { show: true } });

		expect(container.textContent).toContain('flowchart');
		expect(container.textContent).toContain('sequence diagram');
	});
});
