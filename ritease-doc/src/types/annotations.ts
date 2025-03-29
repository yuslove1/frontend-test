export interface Annotation {
    type: "highlight" | "underline" | "comment" | "signature";
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    text?: string;
    points?: number[];
    pageIndex: number;
  }
  
  export interface PageDimension {
    width: number;
    height: number;
  }

  export interface PDFViewerProps {
      pdfFile: File;
      scale: number;
      activeTool: string | null;
      color: string;
      annotations: Annotation[];
      setAnnotations: (annotations: Annotation[] | ((prev: Annotation[]) => Annotation[])) => void;
      pageDimensions: PageDimension[];
      setPageDimensions: React.Dispatch<React.SetStateAction<PageDimension[]>>;
      setStatus: React.Dispatch<React.SetStateAction<string>>;
      onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
    }
    
    // Minimal type for PDF page object
    export interface PDFPage {
      width: number;
      height: number;
    }