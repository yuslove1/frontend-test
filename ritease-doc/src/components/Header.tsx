import { exportPDF } from "../utils/pdfUtils";
import { Annotation, PageDimension } from "../types/annotations";

interface HeaderProps {
  pdfFile: File | null;
  annotations: Annotation[];
  pageDimensions: PageDimension[];
  undo: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({
  pdfFile,
  annotations,
  pageDimensions,
  undo,
  isSidebarOpen,
  toggleSidebar,
}: HeaderProps) {
  // Export the PDF with annotations applied
  const handleExport = async () => {
    if (!pdfFile) return; // No file to export
    try {
      await exportPDF(pdfFile, annotations, pageDimensions);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    // Header layout with toggle button and action buttons
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-sm">
      <div className="flex items-center">
        {/* Hamburger button for sidebar toggle on small screens */}
        <button
          className="md:hidden p-2 mr-2 bg-gray-800 text-white rounded"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "✕" : "☰"} {/* Show close or menu icon */}
        </button>

      </div>
      <div className="space-x-2">
        {/* Undo button, disabled if no annotations */}
        <button
          onClick={undo}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          disabled={annotations.length === 0}
        >
          Undo
        </button>
        {/* Export button, disabled if no PDF */}
        <button
          onClick={handleExport}
          className="px-4 py-2 border rounded transition"
          disabled={!pdfFile}
        >
          Export PDF
        </button>
      </div>
    </header>
  );
}