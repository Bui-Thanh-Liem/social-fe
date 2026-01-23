export function LoadingProcess() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      <span className="ml-2">Đang tải...</span>
    </div>
  );
}
