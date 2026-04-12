import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/** 
 * Utility to export an HTML element as a pdf image
 * @param options Set options for pdf the exporter
 * @example
 * const { ref, exportPdf } = PdfExport<HTMLDivElement>({
    filename: `filename.pdf`,
    scale: 2,
    orientation: "portrait",
  });
  @returns reference for the element converted to an image and a callback function converting it to pdf
  @author James Wilson
*/

interface ExportOptions {
  filename?: string;
  format?: 'a4' | 'letter' | 'a3';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  scale?: number;
  quality?: number;
}

export function PdfExport<T extends HTMLElement>(options: ExportOptions = {}) {
  const ref = useRef<T>(null);

  const exportPdf = useCallback(async () => {
    const element = ref.current;
    if (!element) return;

    const { filename = 'export.pdf', scale = 2, format = 'a4', orientation = 'portrait' } = options;

    const imgData = await toPng(element, {
      cacheBust: true,
      pixelRatio: scale,
    });

    const pdf = new jsPDF({ orientation, format, unit: 'px' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = imgData;
    await new Promise((res) => (img.onload = res));

    const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
    pdf.addImage(imgData, 'PNG', 0, 0, img.width * ratio, img.height * ratio);
    pdf.save(filename);
  }, [options]);

  return { ref, exportPdf };
}