"use client";

import { useState, ReactNode } from "react";

function TextExpander({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  // const displayText = isExpanded
  //   ? children
  //   : children.split(" ").slice(0, 40).join(" ") + "...";

  let displayText: ReactNode;

  if (!isExpanded && typeof children === "string") {
    displayText = children.split(" ").slice(0, 40).join(" ") + "...";
  } else {
    displayText = children;
  }

  return (
    <span>
      {displayText}{" "}
      <button
        className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}

export default TextExpander;
