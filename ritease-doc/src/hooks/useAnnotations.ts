import { useState } from "react";
import { Annotation } from "../types/annotations";

export function useAnnotations() {
  // Current list of annotations applied to the PDF
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  // History stack for undo functionality
  const [history, setHistory] = useState<Annotation[][]>([]);

  // Custom setter that saves current state to history before updating annotations
  const handleSetAnnotations = (newAnnotations: Annotation[] | ((prev: Annotation[]) => Annotation[])) => {
    setHistory((prev) => [...prev, annotations]); // Add current annotations to history
    setAnnotations(newAnnotations); // Update annotations
  };

  // Revert to the previous state of annotations
  const undo = () => {
    if (history.length === 0) return; // No history to undo
    const previousState = history[history.length - 1];
    setAnnotations(previousState); // Restore previous annotations
    setHistory((prev) => prev.slice(0, -1)); // Remove last history entry
  };

  return { annotations, setAnnotations: handleSetAnnotations, undo };
}