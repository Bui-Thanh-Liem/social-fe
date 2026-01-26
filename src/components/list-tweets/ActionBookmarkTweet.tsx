import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useBookmarkTweet } from "~/apis/useFetchBookmark";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ActionBookmarkTweet({ tweet }: { tweet: ITweet }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { mutate: toggleBookmark } = useBookmarkTweet();

  //
  useEffect(() => {
    setIsBookmarked(!!tweet.is_bookmark);
  }, []);

  //
  function handleBookmarked() {
    toggleBookmark(tweet._id);
    setIsBookmarked(!isBookmarked);
  }

  //
  return (
    <button
      className={`p-2 rounded-full transition-colors cursor-pointer ${
        isBookmarked
          ? "text-blue-500"
          : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
      }`}
      onClick={handleBookmarked}
    >
      <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
}
