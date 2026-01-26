import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLikeTweet } from "~/apis/useFetchLike";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ActionLikeTweet({ tweet }: { tweet: ITweet }) {
  const [isLiked, setIsLiked] = useState(false);
  const [countLiked, setCountLiked] = useState(0);
  const { mutate: toggleLike } = useLikeTweet();

  //
  useEffect(() => {
    setIsLiked(!!tweet.is_like);
    setCountLiked(tweet.likes_count ?? 0);
  }, [tweet.is_like, tweet.likes_count]);

  //
  function handleLike() {
    toggleLike(tweet._id);
    setIsLiked(!isLiked);
    if (isLiked) {
      setCountLiked((prev) => prev - 1);
    } else {
      setCountLiked((prev) => prev + 1);
    }
  }

  //
  return (
    <button
      className={`flex items-center space-x-2 transition-colors group cursor-pointer ${
        isLiked ? "text-pink-500" : "hover:text-pink-500"
      }`}
      onClick={handleLike}
    >
      <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      </div>
      <span className="text-sm">{countLiked}</span>
    </button>
  );
}
