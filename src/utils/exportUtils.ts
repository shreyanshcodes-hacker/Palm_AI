import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Capture an HTML element as PNG image file download
 */
export async function downloadElementAsPng(elementId: string, filename: string = 'PalmAI-Reading.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id '${elementId}' not found.`);
  }

  // Generate PNG data URL at high pixel ratio for high quality
  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#FAF9F6', // Luxury cream/white background
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Convert HTML element to high resolution multi-page or single high-res PDF
 */
export async function downloadElementAsPdf(elementId: string, filename: string = 'PalmAI-Reading.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id '${elementId}' not found.`);
  }

  // Generate PNG data URL from element
  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#FAF9F6',
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgProps = pdf.getImageProperties(dataUrl);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  const pageHeight = pdf.internal.pageSize.getHeight();
  let heightLeft = pdfHeight;
  let position = 0;

  // Render first page
  pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  // Add additional pages if report is taller than single page
  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
