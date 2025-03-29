import { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "../utils/commonUtils";
import { PageDimension } from "../types/annotations";

export function useScale(
  containerRef: React.RefObject<HTMLDivElement>,
  pageDimensions: PageDimension[],
  numPages: number | null
) {
  const [scale, setScale] = useState(1);
  const hasScaledRef = useRef(false);

  // Calculate scale based on container and page dimensions
  const calculateScale = useCallback(() => {
    if (!containerRef.current || pageDimensions.length === 0) {
      return; // Exit early if ref is null or no dimensions available
    }
    const containerWidth = containerRef.current.offsetWidth;
    const pdfWidth = pageDimensions[0].width;
    const newScale = Math.min(containerWidth / pdfWidth, 1);
    setScale(newScale);
    hasScaledRef.current = true;
  }, [containerRef, pageDimensions]);

  useEffect(() => {
    const debouncedCalculateScale = debounce(calculateScale, 200);
    if (!hasScaledRef.current && pageDimensions.length === numPages && numPages !== null) {
      calculateScale(); // Initial scale calculation
    }
    window.addEventListener("resize", debouncedCalculateScale);
    return () => window.removeEventListener("resize", debouncedCalculateScale); // Cleanup
  }, [calculateScale, numPages, pageDimensions.length]);

  return scale;
}