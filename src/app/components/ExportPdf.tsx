"use client";

import { useRef } from "react";

interface ExportPdfProps {
  targetId: string; // ID of the HTML element to export
  filename?: string;
}

export default function ExportPdf({
  targetId,
  filename = "export.pdf",
}: ExportPdfProps) {
  const isExporting = useRef(false);

  const handleExport = async () => {
    if (isExporting.current) return;
    isExporting.current = true;

    const element = document.getElementById(targetId);
    if (!element) {
      console.error(`Element with id "${targetId}" not found`);
      isExporting.current = false;
      return;
    }

    // Dynamically import to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;

    const options: any = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();
    isExporting.current = false;
  };

  return <button onClick={handleExport}>Export PDF</button>;
}
