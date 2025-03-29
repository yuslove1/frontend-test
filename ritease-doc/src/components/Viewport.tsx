import { useRef, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useScale } from "../hooks/useScale";
import PDFViewer from "./PDFViewer";
import { Annotation, PageDimension } from "../types/annotations";

interface ViewportProps {
  pdfFile: File | null;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  activeTool: string | null;
  color: string;
  annotations: Annotation[];
  setAnnotations: (annotations: Annotation[] | ((prev: Annotation[]) => Annotation[])) => void;
  pageDimensions: PageDimension[];
  setPageDimensions: React.Dispatch<React.SetStateAction<PageDimension[]>>;
  undo: () => void;
}

export default function Viewport({
  pdfFile,
  setPdfFile,
  setStatus,
  activeTool,
  color,
  annotations,
  setAnnotations,
  pageDimensions,
  setPageDimensions,
}: ViewportProps) {
  // Ref to measure viewport container
  const viewportRef = useRef<HTMLDivElement | null>(null);
  // Track number of pages for scale calculation
  const [numPages, setNumPages] = useState<number | null>(null);
  // Get responsive scale, no type assertion needed
  const scale = useScale(viewportRef as React.RefObject<HTMLDivElement>, pageDimensions, numPages);

  // Handle PDF file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/pdf") {
        setPdfFile(file);
        setStatus("PDF Uploaded");
      } else {
        setStatus("Error: Please upload a PDF file");
      }
    },
    [setPdfFile, setStatus]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Update numPages when PDF loads
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <main className="w-full p-6 flex flex-col items-center overflow-auto h-full" ref={viewportRef}>
      {!pdfFile ? (
        <div
          {...getRootProps()}
          className={`w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 ${
            isDragActive ? "bg-gray-100" : ""
          }`}
        >
          <input {...getInputProps()} />
          <p>Drop PDF Here or Click to Upload</p>
        </div>
      ) : (
        <PDFViewer
          pdfFile={pdfFile}
          scale={scale}
          activeTool={activeTool}
          color={color}
          annotations={annotations}
          setAnnotations={setAnnotations}
          pageDimensions={pageDimensions}
          setPageDimensions={setPageDimensions}
          setStatus={setStatus}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />
      )}
    </main>
  );
}