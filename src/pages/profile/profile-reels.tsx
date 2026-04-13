import { useEffect, useRef, useState } from "react";
import { useGetProfileReels } from "~/apis/reel.api";
import { SkeletonTweet } from "~/components/list-tweets/tweet-item";
import { ReelItem } from "~/components/reel/reels-List";
import { ErrorResponse } from "~/components/state/error";
import { NotThing } from "~/components/state/not-thing";
import type { IReel } from "~/shared/interfaces/schemas/reel.interface";

export function ProfileReels({ profile_id }: { profile_id: string }) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allReels, setAllReels] = useState<IReel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, isFetching } = useGetProfileReels(
    profile_id,
    {
      limit: "10",
      user_id: profile_id,
      page: page.toString(),
    },
  );

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newReels = data.metadata.items as IReel[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllReels(newReels);
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setAllReels((prev) => {
          // Loại bỏ duplicate reels dựa trên _id
          const existingIds = new Set(prev.map((reel) => reel._id));
          const filteredNewReels = newReels.filter(
            (reel) => !existingIds.has(reel._id),
          );
          return [...prev, ...filteredNewReels];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newReels.length < 10) {
        // Nếu số reels trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, profile_id]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (
      entry.isIntersecting &&
      hasMore &&
      !isLoading &&
      !isLoadingMore &&
      allReels.length > 0
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
    // setAllReels([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [profile_id]);

  // Thực hiện khi xoá thành công reel
  // function onDel(id: string) {
  //   setAllReels((prev) => prev.filter((re) => re._id !== id));
  // }

  const loading = isLoading || isFetching;

  return (
    <div>
      {loading && page === 1 && <SkeletonTweet />}

      {/* Reels list */}
      {allReels.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {allReels.map((reel, index: number) => (
            <ReelItem
              reel={reel}
              key={reel._id || `${reel._id}-${index}`}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorResponse
          onRetry={() => {
            setPage(1);
            setAllReels([]);
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
      {!loading && allReels.length === 0 && page === 1 && <NotThing />}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && allReels.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả tin!</p>
        </div>
      )}
    </div>
  );
}
