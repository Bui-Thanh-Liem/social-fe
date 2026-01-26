export function TypingIndicator({
  show = true,
  className = "",
  authorName,
}: {
  className?: string;
  show?: boolean;
  authorName?: string;
}) {
  if (!show) return null;

  return (
    <div className="flex flex-col justify-center items-center h-16">
      <div
        className={`flex items-center justify-start ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex gap-1">
          <span
            className="dot bg-gray-400 dark:bg-gray-400 w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="dot bg-gray-400 dark:bg-gray-400 w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="dot bg-gray-400 dark:bg-gray-400 w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
      <span className="text-gray-300 text-sm">{authorName} đang bình luận</span>
    </div>
  );
}
