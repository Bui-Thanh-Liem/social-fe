import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchTweets } from "~/apis/useFetchSearch";
import { ErrorResponse } from "~/components/error";
import { Card, CardContent } from "~/components/ui/card";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";

export function MediaTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");

  //
  const { open, setTweet } = useDetailTweetStore();

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useSearchTweets({
    limit: "12",
    q: q ?? "",
    pf: pf ?? "",
    f: (f as "media") ?? "media",
    page: page.toString(),
  });

  //
  useEffect(() => {
    setTweets([]);
    setPage(1);
    refetch();
  }, [q, pf, f]);

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newTweets = data.metadata.items as ITweet[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setTweets(() => {
          return newTweets;
        });
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setTweets((prev) => {
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
        tweets.length > 0
      ) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [tweets.length, hasMore, isLoading, isLoadingMore],
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

  //
  function handleClickMedia(tweet: ITweet) {
    open();
    if (tweet) {
      setTweet(tweet);
    }
  }

  const loading = isLoading || isFetching;

  return (
    <div className="max-h-[calc(100vh-(150px))] overflow-y-auto">
      {/* Loading state cho lần load đầu tiên */}
      {loading && page === 1 && (
        <div className="py-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Media grid */}
      {tweets.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {tweets.flatMap((tweet) => {
            return tweet.medias?.map((m, index) => (
              <Card
                key={`profile-media-${index}`}
                className="h-36 overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => handleClickMedia(tweet)}
              >
                <CardContent className="p-0">
                  {m?.file_type.startsWith("video/") ? (
                    <video
                      src={m?.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={m?.url}
                      alt={m?.url}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ));
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state - chưa có data nhưng không phải total = 0 */}
      {!loading && tweets.length === 0 && page === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">
            Không có hình ảnh hoặc video nào phù hợp với <strong>"{q}"</strong>
          </p>
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && tweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            🎉 Bạn đã xem hết tất cả hình ảnh và video!
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <ErrorResponse
          onRetry={() => {
            setPage(1);
            setTweets([]);
            setHasMore(true);
          }}
        />
      )}
    </div>
  );
}
