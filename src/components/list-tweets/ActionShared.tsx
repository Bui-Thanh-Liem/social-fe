import { Share } from "lucide-react";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { toastSimple } from "~/utils/toast";

const apiUrl = import.meta.env.VITE_CLIENT_URL;

export function ActionShared({ tweet }: { tweet: ITweet }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${apiUrl}/tweet/${tweet._id}`);
      toastSimple("Đã sao chép liên kết bài viết", "success");
    } catch {
      toastSimple("Sao chép liên kết bài viết thất bại", "error");
    }
  };

  return (
    <button
      className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={handleCopy}
    >
      <Share size={18} />
    </button>
  );
}
