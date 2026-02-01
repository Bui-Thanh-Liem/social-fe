import { useCallback, useEffect, useRef, useState } from "react";
import { useGetProfileTweets } from "~/apis/useFetchTweet";
import { ErrorResponse } from "~/components/Error";
import { Card, CardContent } from "~/components/ui/card";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";

export function ProfileMedia({
  profile_id,
  isOwnProfile,
}: {
  profile_id: string;
  isOwnProfile: boolean;
}) {
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

  const { data, isLoading, error } = useGetProfileTweets(ETweetType.Tweet, {
    limit: "10",
    isMedia: "1",
    user_id: profile_id,
    page: page.toString(),
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newMedia = data.metadata.items;
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setTweets(() => {
          return newMedia;
        });
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setTweets((prev) => {
          const existingUrls = new Set(
            prev.flatMap((p) => p.medias?.map((m) => m.url) || []),
          );

          const filteredNewMedia = newMedia.map((item) => ({
            ...item,
            medias: item.medias?.filter((m) => !existingUrls.has(m.url)) || [],
          }));

          return [...prev, ...filteredNewMedia];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newMedia.length < 10) {
        // Nếu số media trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, profile_id]);

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
    [hasMore, isLoading, isLoadingMore, tweets.length],
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
    // setAllMedia([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi profile
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [profile_id]);

  // Error state
  if (error) {
    return (
      <ErrorResponse
        onRetry={() => {
          setPage(1);
          setTweets([]);
          setHasMore(true);
          window.location.reload();
        }}
      />
    );
  }

  //
  function handleClickMedia(tweet: ITweet) {
    open();
    if (tweet) {
      setTweet(tweet);
    }
  }

  return (
    <div className="px-4">
      {/* Medias grid */}
      {tweets.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.flatMap((tweet) => {
            return tweet.medias?.map((m, index) => (
              <Card
                key={`profile-media-${tweet._id}-${index}`}
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
                        e.currentTarget.src = "/favicon.png"; // Fallback image
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
      {!isLoading && tweets.length === 0 && page === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">📷 Chưa có media nào</p>
          <p className="text-gray-400">
            {isOwnProfile
              ? "Hãy đăng ảnh hoặc video để chúng xuất hiện ở đây!"
              : "Người dùng chưa đăng bài viết."}
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
    </div>
  );
}
