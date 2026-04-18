import { useCallback } from "react";

// Custom hook for emoji insertion
export const useEmojiInsertion = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) => {
  const insertEmoji = useCallback(
    (emoji: string, currentContent: string) => {
      const textarea = textareaRef?.current;
      if (!textarea) return currentContent;

      const cursorPosition = textarea.selectionStart;
      const textBefore = currentContent.substring(0, cursorPosition);
      const textAfter = currentContent.substring(cursorPosition);
      const newContent = textBefore + emoji + textAfter;

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPosition + emoji.length,
          cursorPosition + emoji.length
        );
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });

      return newContent;
    },
    [textareaRef]
  );

  return { insertEmoji };
};
