import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPNG(element: HTMLElement, filename: string = 'diagram.png') {
	try {
		const canvas = await html2canvas(element, {
			backgroundColor: '#ffffff',
			scale: 2
		});
		const link = document.createElement('a');
		link.download = filename;
		link.href = canvas.toDataURL('image/png');
		link.click();
	} catch (error) {
		console.error('Error exporting to PNG:', error);
		throw error;
	}
}

export async function exportToSVG(element: HTMLElement, filename: string = 'diagram.svg') {
	try {
		const svg = element.querySelector('svg');
		if (!svg) {
			throw new Error('No SVG found in element');
		}

		const svgData = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([svgData], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.download = filename;
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Error exporting to SVG:', error);
		throw error;
	}
}

export async function exportToPDF(element: HTMLElement, filename: string = 'diagram.pdf') {
	try {
		const canvas = await html2canvas(element, {
			backgroundColor: '#ffffff',
			scale: 2
		});

		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF({
			orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
			unit: 'px',
			format: [canvas.width, canvas.height]
		});

		pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
		pdf.save(filename);
	} catch (error) {
		console.error('Error exporting to PDF:', error);
		throw error;
	}
}
