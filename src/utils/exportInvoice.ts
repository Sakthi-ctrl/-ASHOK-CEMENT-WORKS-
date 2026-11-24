import { toJpeg, toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Filter function to exclude elements marked with 'no-export' during capture
 */
const filterNoExport = (node: HTMLElement) => {
  if (node.classList && node.classList.contains('no-export')) {
    return false;
  }
  return true;
};

/**
 * Download Invoice as PNG
 */
export const downloadInvoicePng = async (
  elementId: string,
  filename: string = 'Ashok-Cement-Invoice'
): Promise<boolean> => {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 2.5,
      backgroundColor: '#FFFFFF',
      filter: filterNoExport,
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export invoice as PNG:', error);
    throw error;
  }
};

/**
 * Download Invoice as JPG
 */
export const downloadInvoiceJpg = async (
  elementId: string,
  filename: string = 'Ashok-Cement-Invoice'
): Promise<boolean> => {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    const dataUrl = await toJpeg(node, {
      quality: 0.95,
      pixelRatio: 2.5,
      backgroundColor: '#FFFFFF',
      filter: filterNoExport,
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export invoice as JPG:', error);
    throw error;
  }
};

/**
 * Download Invoice as PDF (A4 Portrait)
 */
export const downloadInvoicePdf = async (
  elementId: string,
  filename: string = 'Ashok-Cement-Invoice'
): Promise<boolean> => {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Generate high resolution image first for pixel-perfect fidelity
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 2.5,
      backgroundColor: '#FFFFFF',
      filter: filterNoExport,
      cacheBust: true,
    });

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // We leave a small aesthetic margin (e.g. 5mm) or full bleed
    const margin = 6;
    const printWidth = pdfWidth - margin * 2;
    // Calculate aspect ratio
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgHeight = (imgProps.height * printWidth) / imgProps.width;

    // Check if it fits on a single A4 page
    if (imgHeight <= pdfHeight - margin * 2) {
      pdf.addImage(dataUrl, 'PNG', margin, margin, printWidth, imgHeight, undefined, 'FAST');
    } else {
      // Scale slightly to fit perfectly on one A4 page
      const scaleFactor = (pdfHeight - margin * 2) / imgHeight;
      const finalWidth = printWidth * scaleFactor;
      const finalX = (pdfWidth - finalWidth) / 2;
      pdf.addImage(dataUrl, 'PNG', finalX, margin, finalWidth, pdfHeight - margin * 2, undefined, 'FAST');
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to export invoice as PDF:', error);
    throw error;
  }
};

/**
 * Trigger native print dialog
 */
export const triggerPrint = (): void => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};
