import { useCallback, useRef } from "react";

// Custom hook for textarea auto-resize functionality
export const useTextareaAutoResize = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(
    (element: HTMLTextAreaElement, maxLines = 12) => {
      let value = element.value;

      // Limit to max lines
      const lines = value.split("\n");
      if (lines.length > maxLines) {
        value = lines.slice(0, maxLines).join("\n");
        element.value = value;
      }

      // Auto resize height
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;

      return value;
    },
    []
  );

  return { textareaRef, autoResize };
};
