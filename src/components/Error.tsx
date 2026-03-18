import { ButtonMain } from "./ui/button";

export function ErrorResponse({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">❌ Có lỗi xảy ra khi tải dữ liệu </p>
      <ButtonMain onClick={onRetry}>Thử lại</ButtonMain>
    </div>
  );
}
