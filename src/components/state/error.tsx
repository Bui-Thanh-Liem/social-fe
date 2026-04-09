import { AlertCircle, RefreshCcw } from "lucide-react";
import { ButtonMain } from "../ui/button";

interface ErrorResponseProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function ErrorResponse({
  title = "Đã xảy ra sự cố",
  message = "Hệ thống không thể kết nối được với máy chủ. Vui lòng kiểm tra lại đường truyền của bạn.",
  onRetry,
}: ErrorResponseProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon Container với hiệu ứng Error Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/15 blur-2xl rounded-full animate-pulse" />
        <div className="relative flex items-center justify-center w-20 h-20 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed">
          {message}
        </p>
      </div>

      {/* Retry Button */}
      <div className="mt-8">
        <ButtonMain
          size="sm"
          onClick={onRetry}
          className="group flex items-center gap-2 transition-all"
        >
          <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          <span className="font-semibold">Thử lại ngay</span>
        </ButtonMain>
      </div>

      {/* Decorative tag */}
      <div className="mt-12">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
          Error Code: 500_INTERNAL_SERVER
        </span>
      </div>
    </div>
  );
}
