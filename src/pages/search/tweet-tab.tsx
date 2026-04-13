import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchTweets } from "~/apis/search.api";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/tweet-item";
import { ErrorResponse } from "~/components/state/error";
import { NotThing } from "~/components/state/not-thing";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function TweetTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useSearchTweets({
    limit: "10",
    q: q ?? "",
    pf: pf ?? "",
    page: page.toString(),
  });

  //
  useEffect(() => {
    setAllTweets([]);
    setPage(1);
    refetch();
  }, [q, pf, f]);

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newTweets = data.metadata.items as ITweet[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllTweets(() => {
          return newTweets;
        });
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
  }, [data, page]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
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
    },
    [allTweets.length, hasMore, isLoading, isLoadingMore],
  );

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

  // Reset khi profile_id thay đổi
  useEffect(() => {
    setPage(1);
    // setAllTweets([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi feedType
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [q]);

  // Thực hiện khi xoá thành công tweet
  function onDel(id: string) {
    setAllTweets((prev) => prev.filter((tw) => tw._id !== id));
  }

  const loading = isLoading || isFetching;

  return (
    <div className="overflow-y-auto">
      {/* Loading state cho lần load đầu tiên */}
      {loading && page === 1 && <SkeletonTweet />}

      {/* Tweets list */}
      {allTweets.length > 0 && (
        <div className="space-y-4">
          {allTweets.map((tweet) => (
            <TweetItem key={tweet._id} tweet={tweet} onSuccessDel={onDel} />
          ))}
        </div>
      )}

      {/* Loading more indicator */}
      {loading && (
        <div className="py-4">
          <SkeletonTweet count={2} />
        </div>
      )}

      {/* Empty state - chưa có data nhưng không phải total = 0 */}
      {!loading && allTweets.length === 0 && page === 1 && (
        <NotThing
          type="search"
          description={`Không có bài viết phù hợp với "${q}"`}
        />
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && allTweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả tweet!</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <ErrorResponse
          onRetry={() => {
            setPage(1);
            setAllTweets([]);
            setHasMore(true);
          }}
        />
      )}
    </div>
  );
}
