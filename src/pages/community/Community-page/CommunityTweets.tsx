import { useEffect, useRef, useState } from "react";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/ItemTweet";
import { NotFoundTweet } from "~/components/list-tweets/NotFoundTweet";
import { useGetCommunityTweets } from "~/apis/useFetchTweet";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { ErrorResponse } from "~/components/Error";

export function CommunityTweets({
  q,
  ishl = "0",
  community_id,
}: {
  q?: string;
  ishl?: "1" | "0";
  community_id: string;
}) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, isFetching } = useGetCommunityTweets({
    limit: "10",
    ishl: ishl,
    community_id: community_id,
    page: page.toString(),
    q: q || "",
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newTweets = data.metadata.items as ITweet[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllTweets(newTweets);
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setAllTweets((prev) => {
          // Loại bỏ duplicate tweets dựa trên _id
          const existingIds = new Set(prev.map((tweet) => tweet._id));
          const filteredNewTweets = newTweets.filter(
            (tweet) => !existingIds.has(tweet._id),
          );
          return [...prev, ...filteredNewTweets];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newTweets.length < 10) {
        // Nếu số tweets trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, community_id]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (
      entry.isIntersecting &&
      hasMore &&
      !isLoading &&
      !isLoadingMore &&
      allTweets.length > 0
    ) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Setup Intersection Observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    // Create new observer
    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0, // Trigger when 0% of element is visible
      rootMargin: "0px", // Start loading 0px before element comes into view
    });

    observerInstanceRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi profile_id hoặc tweetType thay đổi
  useEffect(() => {
    setPage(1);
    // setAllTweets([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [community_id]);

  // Thực hiện khi xoá thành công tweet
  function onDel(id: string) {
    setAllTweets((prev) => prev.filter((tw) => tw._id !== id));
  }

  const loading = isLoading || isFetching;

  return (
    <div>
      {loading && page === 1 && <SkeletonTweet />}

      {/* Tweets list */}
      {allTweets.length > 0 && (
        <div className="space-y-6">
          {allTweets.map((tweet, index: number) => (
            <span key={tweet._id}>
              <TweetItem
                tweet={tweet}
                onSuccessDel={onDel}
                key={tweet._id || `${tweet._id}-${index}`}
              />
              {index < allTweets.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </span>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorResponse
          onRetry={() => {
            setPage(1);
            setAllTweets([]);
            setHasMore(true);
            window.location.reload();
          }}
        />
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <SkeletonTweet />
        </div>
      )}

      {/* Empty state - chưa có data nhưng không phải total = 0 */}
      {!loading && allTweets.length === 0 && page === 1 && <NotFoundTweet />}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && allTweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả bài viết!</p>
        </div>
      )}
    </div>
  );
}
