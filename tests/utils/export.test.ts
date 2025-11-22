import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPNG, exportToSVG, exportToPDF } from '$lib/utils/export';

// Mock html2canvas
vi.mock('html2canvas', () => ({
	default: vi.fn(() =>
		Promise.resolve({
			toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data'),
			width: 800,
			height: 600
		})
	)
}));

// Mock jsPDF
vi.mock('jspdf', () => {
	const mockPDF = {
		addImage: vi.fn(),
		save: vi.fn()
	};
	return {
		default: vi.fn(() => mockPDF)
	};
});

describe('Export Utils', () => {
	let mockElement: HTMLElement;
	let mockLink: HTMLAnchorElement;

	beforeEach(() => {
		// Create mock SVG element
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '400');
		svg.setAttribute('height', '300');

		// Create mock container element
		mockElement = document.createElement('div');
		mockElement.appendChild(svg);

		// Mock document.createElement for anchor links
		mockLink = document.createElement('a');
		mockLink.click = vi.fn();
		vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

		// Mock URL methods
		global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
		global.URL.revokeObjectURL = vi.fn();
	});

	describe('exportToPNG', () => {
		it('should export element to PNG', async () => {
			await exportToPNG(mockElement, 'test-diagram.png');

			expect(mockLink.download).toBe('test-diagram.png');
			expect(mockLink.click).toHaveBeenCalled();
		});

		it('should use default filename if not provided', async () => {
			await exportToPNG(mockElement);

			expect(mockLink.download).toBe('diagram.png');
		});

		it('should handle errors gracefully', async () => {
			const { default: html2canvas } = await import('html2canvas');
			vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Canvas error'));

			await expect(exportToPNG(mockElement)).rejects.toThrow();
		});
	});

	describe('exportToSVG', () => {
		it('should export SVG element', async () => {
			await exportToSVG(mockElement, 'test-diagram.svg');

			expect(mockLink.download).toBe('test-diagram.svg');
			expect(mockLink.click).toHaveBeenCalled();
			expect(global.URL.createObjectURL).toHaveBeenCalled();
		});

		it('should use default filename if not provided', async () => {
			await exportToSVG(mockElement);

			expect(mockLink.download).toBe('diagram.svg');
		});

		it('should handle elements without SVG', async () => {
			// Restore original createElement for this test
			vi.restoreAllMocks();

			const emptyElement = document.createElement('div');

			try {
				await exportToSVG(emptyElement);
				// If we get here, test should fail
				expect(true).toBe(false);
			} catch (error: any) {
				expect(error.message).toBe('No SVG found in element');
			}
		});

		it('should revoke object URL after download', async () => {
			await exportToSVG(mockElement);

			expect(global.URL.revokeObjectURL).toHaveBeenCalled();
		});
	});

	describe('exportToPDF', () => {
		it('should export element to PDF', async () => {
			const { default: jsPDF } = await import('jspdf');

			await exportToPDF(mockElement, 'test-diagram.pdf');

			expect(jsPDF).toHaveBeenCalled();
		});

		it('should use default filename if not provided', async () => {
			const { default: jsPDF } = await import('jspdf');
			const mockPDFInstance = new jsPDF();

			await exportToPDF(mockElement);

			expect(mockPDFInstance.save).toHaveBeenCalledWith('diagram.pdf');
		});

		it('should handle errors gracefully', async () => {
			const { default: html2canvas } = await import('html2canvas');
			vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Canvas error'));

			await expect(exportToPDF(mockElement)).rejects.toThrow();
		});

		it('should add image to PDF', async () => {
			const { default: jsPDF } = await import('jspdf');
			const mockPDFInstance = new jsPDF();

			await exportToPDF(mockElement, 'test.pdf');

			expect(mockPDFInstance.addImage).toHaveBeenCalled();
		});
	});
});
