import { Ghost, Plus, Search } from "lucide-react";

interface NotThingProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "default" | "search";
}

export const NotThing = ({
  title = "Chưa có nội dung nào",
  description = "Vũ trụ này hiện đang tạm yên ắng. Hãy là người đầu tiên phá vỡ sự tĩnh lặng này !",
  actionLabel = "Tạo bài viết mới",
  onAction,
  type = "default",
}: NotThingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in zoom-in duration-500">
      {/* Icon Container với hiệu ứng Ring Soft */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl shadow-sm border border-gray-200/50 dark:border-neutral-700/50">
          {type === "search" ? (
            <Search className="w-10 h-10 text-gray-400" />
          ) : (
            <Ghost className="w-10 h-10 text-gray-400 animate-bounce-slow" />
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-sm space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-8 group relative inline-flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white dark:text-black text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}

      {/* Thêm một chút trang trí nhỏ ở dưới */}
      <div className="mt-12 flex gap-1.5 justify-center opacity-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        ))}
      </div>
    </div>
  );
};
