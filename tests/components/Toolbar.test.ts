import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Toolbar from '$lib/components/Toolbar.svelte';
import { diagramStore } from '$lib/stores/diagram';

// Mock export functions
vi.mock('$lib/utils/export', () => ({
	exportToPNG: vi.fn(() => Promise.resolve()),
	exportToSVG: vi.fn(() => Promise.resolve()),
	exportToPDF: vi.fn(() => Promise.resolve())
}));

describe('Toolbar', () => {
	let mockPreviewElement: HTMLElement;

	beforeEach(() => {
		// Reset diagram store
		diagramStore.set({
			code: 'graph TD\n    A --> B',
			title: 'Test Diagram'
		});

		// Create mock preview element with SVG
		mockPreviewElement = document.createElement('div');
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		mockPreviewElement.appendChild(svg);

		// Mock localStorage
		Storage.prototype.getItem = vi.fn(() => null);
		Storage.prototype.setItem = vi.fn();
	});

	it('should render toolbar with logo and title', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.value).toBe('Test Diagram');
	});

	it('should allow editing diagram title', async () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'New Title' } });

		expect(input.value).toBe('New Title');
	});

	it('should render My Diagrams link', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const link = container.querySelector('a[href="/my-diagrams"]');
		expect(link).toBeTruthy();
		expect(link?.textContent).toContain('My Diagrams');
	});

	it('should render Templates button', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const button = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Templates')
		);
		expect(button).toBeTruthy();
	});

	it('should render Save button', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const button = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Save')
		);
		expect(button).toBeTruthy();
	});

	it('should render Share button', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const button = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Share')
		);
		expect(button).toBeTruthy();
	});

	it('should render Export button', () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const button = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Export')
		);
		expect(button).toBeTruthy();
	});

	it('should save diagram to localStorage when Save is clicked', async () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const saveButton = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Save')
		);

		if (saveButton) {
			await fireEvent.click(saveButton);
			expect(localStorage.setItem).toHaveBeenCalled();
		}
	});

	it('should show export menu when Export is clicked', async () => {
		const { container } = render(Toolbar, { props: { previewElement: mockPreviewElement } });

		const exportButton = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Export')
		);

		if (exportButton) {
			await fireEvent.click(exportButton);

			// Check for export options
			const exportOptions = container.textContent;
			expect(exportOptions).toContain('Export as PNG');
			expect(exportOptions).toContain('Export as SVG');
			expect(exportOptions).toContain('Export as PDF');
		}
	});

	it('should open template panel when Templates is clicked', async () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const templatesButton = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Templates')
		);

		if (templatesButton) {
			await fireEvent.click(templatesButton);
			// Template panel should be rendered
			expect(container.querySelector('h2')?.textContent).toContain('Choose a Template');
		}
	});

	it('should copy share link when Share is clicked', async () => {
		const { container } = render(Toolbar, { props: { previewElement: null } });

		const shareButton = Array.from(container.querySelectorAll('button')).find(
			btn => btn.textContent?.includes('Share')
		);

		if (shareButton) {
			await fireEvent.click(shareButton);
			expect(navigator.clipboard.writeText).toHaveBeenCalled();
		}
	});
});
