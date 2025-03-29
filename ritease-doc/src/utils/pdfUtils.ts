import { PDFDocument, rgb } from "pdf-lib";
import { Annotation, PageDimension } from "../types/annotations";

// Convert hex color to RGB format for pdf-lib
export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Export PDF with annotations applied
export async function exportPDF(pdfFile: File, annotations: Annotation[], pageDimensions: PageDimension[]) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  // Apply each annotation to the corresponding page
  annotations.forEach((ann) => {
    const page = pages[ann.pageIndex];
    const { height } = page.getSize();
    const yOffset = height - (ann.y - ann.pageIndex * pageDimensions[ann.pageIndex].height); // Adjust Y for PDF coordinate system

    const colorRgb = hexToRgb(ann.color || "#000000");

    if (ann.type === "highlight") {
      page.drawRectangle({
        x: ann.x,
        y: yOffset - (ann.height || 0),
        width: ann.width || 0,
        height: ann.height || 0,
        color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        opacity: 0.5, // Semi-transparent for highlights
      });
    } else if (ann.type === "underline") {
      page.drawLine({
        start: { x: ann.x, y: yOffset },
        end: { x: ann.x + (ann.width || 0), y: yOffset },
        thickness: 2,
        color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
      });
    } else if (ann.type === "comment" && ann.text) {
      page.drawText(ann.text, {
        x: ann.x,
        y: yOffset,
        size: 12,
        color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
      });
    } else if (ann.type === "signature" && ann.points) {
      // Draw signature as a series of lines connecting points
      for (let i = 0; i < ann.points.length - 2; i += 2) {
        page.drawLine({
          start: { x: ann.points[i], y: height - ann.points[i + 1] },
          end: { x: ann.points[i + 2], y: height - ann.points[i + 3] },
          thickness: 2,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        });
      }
    }
  });

  // Save and download the annotated PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "annotated.pdf";
  link.click();
  URL.revokeObjectURL(url);
}