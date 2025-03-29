import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { PDFViewerProps, PDFPage } from "../types/annotations";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";


  
export default function PDFViewer({
  pdfFile,
  scale,
  activeTool,
  color,
  annotations,
  setAnnotations,
  pageDimensions,
  setPageDimensions,
  setStatus,
  onDocumentLoadSuccess,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const signaturePointsRef = useRef<number[]>([]);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle PDF load success
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onDocumentLoadSuccess({ numPages });
    setStatus(`PDF Loaded - ${numPages} page${numPages > 1 ? "s" : ""}`);
  };

  // Store page dimensions when a page loads
  const onPageLoadSuccess = (page: PDFPage, index: number) => {
    setPageDimensions((prev) => {
      const updated = [...prev];
      updated[index] = { width: page.width, height: page.height };
      return updated;
    });
  };

  // Get pointer position for mouse/touch events
  const getPosition = (e: KonvaEventObject<MouseEvent | TouchEvent>, pageIndex: number) => {
    const stage = e.target.getStage();
    if (!stage) {
      console.warn("Stage not found");
      return { x: 0, y: 0 };
    }

    const pointer = stage.getPointerPosition();
    if (!pointer) {
      console.warn("Pointer position not available");
      return { x: 0, y: 0 };
    }

    return {
      x: pointer.x / scale,
      y: (pointer.y / scale) + pageIndex * pageDimensions[pageIndex].height,
    };
  };

  // Handle start of annotation
  const handleStart = (e: KonvaEventObject<MouseEvent | TouchEvent>, pageIndex: number) => {
    if (!activeTool || !pageDimensions[pageIndex]) return;
    const scaledPos = getPosition(e, pageIndex);

    if (activeTool === "Highlight" || activeTool === "Underline") {
      dragStartRef.current = scaledPos;
    } else if (activeTool === "Signature") {
      setIsDrawing(true);
      signaturePointsRef.current = [scaledPos.x, scaledPos.y - pageIndex * pageDimensions[pageIndex].height];
    } else if (activeTool === "Comment") {
      const commentText = prompt("Enter your comment:");
      if (commentText) {
        setAnnotations((prev) => [
          ...prev,
          { type: "comment", x: scaledPos.x, y: scaledPos.y, text: commentText, color, pageIndex },
        ]);
      }
    }
    if (e.type.includes("touch")) e.evt.preventDefault();
  };

  // Handle movement during signature drawing
  const handleMove = (e: KonvaEventObject<MouseEvent | TouchEvent>, pageIndex: number) => {
    if (!pageDimensions[pageIndex] || !isDrawing || activeTool !== "Signature") return;
    const scaledPos = getPosition(e, pageIndex);

    signaturePointsRef.current = [
      ...signaturePointsRef.current,
      scaledPos.x,
      scaledPos.y - pageIndex * pageDimensions[pageIndex].height,
    ];
    setAnnotations((prev) => {
      const updated = prev.filter((ann) => !(ann.type === "signature" && ann.pageIndex === pageIndex));
      return [
        ...updated,
        { type: "signature", x: 0, y: 0, points: [...signaturePointsRef.current], color, pageIndex },
      ];
    });
    if (e.type.includes("touch")) e.evt.preventDefault();
  };

  // Handle end of annotation
  const handleEnd = (e: KonvaEventObject<MouseEvent | TouchEvent>, pageIndex: number) => {
    if (!activeTool || !pageDimensions[pageIndex]) return;
    const scaledPos = getPosition(e, pageIndex);

    if ((activeTool === "Highlight" || activeTool === "Underline") && dragStartRef.current) {
      const start = dragStartRef.current;
      const width = scaledPos.x - start.x;
      const height = activeTool === "Highlight" ? 14 : 2;
      const yAdjust = activeTool === "Highlight" ? start.y - height : start.y;

      setAnnotations((prev) => [
        ...prev,
        {
          type: activeTool.toLowerCase() as "highlight" | "underline",
          x: start.x,
          y: yAdjust,
          width: width > 0 ? width : 1,
          height,
          color,
          pageIndex,
        },
      ]);
      dragStartRef.current = null;
    } else if (activeTool === "Signature") {
      setIsDrawing(false);
      signaturePointsRef.current = [];
    }
    if (e.type.includes("touch")) e.evt.preventDefault();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Document
        file={pdfFile}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error("PDF Load Error:", error);
          setStatus(`Error loading PDF: ${error.message}`);
        }}
      >
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index}`} className="relative mb-4 w-full">
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md"
                onLoadSuccess={(page) => onPageLoadSuccess(page, index)}
                scale={scale}
              />
              {pageDimensions[index] && (
                <Stage
                  width={pageDimensions[index].width * scale}
                  height={pageDimensions[index].height * scale}
                  className="absolute top-0 left-0"
                  onMouseDown={(e) => handleStart(e, index)}
                  onMouseMove={(e) => handleMove(e, index)}
                  onMouseUp={(e) => handleEnd(e, index)}
                  onTouchStart={(e) => handleStart(e, index)}
                  onTouchMove={(e) => handleMove(e, index)}
                  onTouchEnd={(e) => handleEnd(e, index)}
                  scaleX={scale}
                  scaleY={scale}
                >
                  <Layer>
                    {annotations
                      .filter((ann) => ann.pageIndex === index)
                      .map((ann, i) => {
                        if (ann.type === "highlight") {
                          return (
                            <Rect
                              key={i}
                              x={ann.x}
                              y={ann.y - index * pageDimensions[index].height}
                              width={ann.width}
                              height={ann.height}
                              fill={`${ann.color}80`}
                            />
                          );
                        } else if (ann.type === "underline") {
                          return (
                            <Rect
                              key={i}
                              x={ann.x}
                              y={ann.y - index * pageDimensions[index].height}
                              width={ann.width}
                              height={ann.height}
                              stroke={ann.color}
                              strokeWidth={2}
                            />
                          );
                        } else if (ann.type === "comment" && ann.text) {
                          return (
                            <Text
                              key={i}
                              x={ann.x}
                              y={ann.y - index * pageDimensions[index].height}
                              text={ann.text}
                              fontSize={12}
                              fill={ann.color}
                              padding={5}
                              background="white"
                              shadowColor="black"
                              shadowBlur={2}
                            />
                          );
                        } else if (ann.type === "signature" && ann.points) {
                          return (
                            <Line
                              key={i}
                              points={ann.points}
                              stroke={ann.color}
                              strokeWidth={2}
                              tension={0.5}
                              lineCap="round"
                              lineJoin="round"
                            />
                          );
                        }
                        return null;
                      })}
                  </Layer>
                </Stage>
              )}
            </div>
          ))}
      </Document>
    </div>
  );
}