import React from "react";

interface SidebarProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  color: string;
  setColor: (color: string) => void;
}

export default function Sidebar({ activeTool, setActiveTool, color, setColor }: SidebarProps) {
  return (
    // Sidebar container with full height and width, vertical layout
    <div className="h-full w-full flex flex-col space-y-4">
      {/* Highlight tool button */}
      <button
        className={`p-2 ${activeTool === "Highlight" ? "bg-yellow-300" : "bg-gray-300"}`}
        onClick={() => setActiveTool("Highlight")}
      >
        Highlight
      </button>
      {/* Underline tool button */}
      <button
        className={`p-2 ${activeTool === "Underline" ? "bg-yellow-300" : "bg-gray-300"}`}
        onClick={() => setActiveTool("Underline")}
      >
        Underline
      </button>
      {/* Comment tool button */}
      <button
        className={`p-2 ${activeTool === "Comment" ? "bg-yellow-300" : "bg-gray-300"}`}
        onClick={() => setActiveTool("Comment")}
      >
        Comment
      </button>
      {/* Signature tool button */}
      <button
        className={`p-2 ${activeTool === "Signature" ? "bg-yellow-300" : "bg-gray-300"}`}
        onClick={() => setActiveTool("Signature")}
      >
        Signature
      </button>
      {/* Color picker for annotation color */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full"
      />
    </div>
  );
}