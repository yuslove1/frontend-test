import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Viewport from "../components/Viewport";
import StatusBar from "../components/Statusbar";
import { useAnnotations } from "../hooks/useAnnotations";
import { PageDimension } from "../types/annotations";

export default function Home() {
  // State for the uploaded PDF file
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // Status message for the status bar
  const [status, setStatus] = useState<string>("Ready");
  // Currently active annotation tool
  const [activeTool, setActiveTool] = useState<string | null>(null);
  // Color for annotations, default yellow
  const [color, setColor] = useState<string>("#FFFF00");
  // Dimensions of each PDF page
  const [pageDimensions, setPageDimensions] = useState<PageDimension[]>([]);
  // Toggle state for sidebar on small screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Custom hook for managing annotations and undo
  const { annotations, setAnnotations, undo } = useAnnotations();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    // Full-screen layout with relative positioning for z-index control
    <div className="flex flex-col h-screen relative">
      {/* Header with sidebar toggle and action buttons */}
      <Header
        pdfFile={pdfFile}
        annotations={annotations}
        pageDimensions={pageDimensions}
        undo={undo}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Overlay on small screens, static on desktop */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out on mobile
          } md:translate-x-0 w-64 md:w-1/5 h-full bg-gray-200 p-4 absolute left-0 z-20 transition-transform duration-300 md:static`}
        >
          <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} color={color} setColor={setColor} />
        </div>
        {/* Viewport: Full width container for PDF or dropzone */}
        <div className="w-full flex-1">
          <Viewport
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            setStatus={setStatus}
            activeTool={activeTool}
            color={color}
            annotations={annotations}
            setAnnotations={setAnnotations}
            pageDimensions={pageDimensions}
            setPageDimensions={setPageDimensions}
            undo={undo}
          />
        </div>
      </div>
      {/* Status bar at the bottom */}
      <StatusBar status={status} />
    </div>
  );
}