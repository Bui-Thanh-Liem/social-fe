export function NotFoundTweet({ isOwn }: { isOwn?: boolean }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg mb-2">✍️ Chưa có bài viết nào</p>
      <p className="text-gray-400">
        {isOwn ? "Hãy tạo bài viết đầu tiên của bạn!" : "Chưa đăng bài viết."}
      </p>
    </div>
  );
}
