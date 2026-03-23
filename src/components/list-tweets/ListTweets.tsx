import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGetNewFeeds } from "~/apis/useFetchTweet";
import { cn } from "~/lib/utils";
import { CommunityShortRow } from "~/pages/community/CommunityShortRow";
import { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useUserStore } from "~/store/useUserStore";
import { ErrorResponse } from "../state/Error";
import { NotThing } from "../state/NotThing";
import { ButtonMain } from "../ui/button";
import { SkeletonTweet, TweetItem } from "./ItemTweet";

export const ListTweets = ({ feedType }: { feedType: EFeedType }) => {
  const { user } = useUserStore();

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [feeds, setFeeds] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetNewFeeds(feedType, {
    page: page.toString(),
    limit: "10", // Giảm limit để load nhanh hơn
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newTweets = data.metadata.items as ITweet[];
      const extraData = data.metadata.extra?.items;
      const extraType = data.metadata.extra?.type;

      const combinedPageData: any[] = [...newTweets];

      if (extraData && extraData.length > 0) {
        const _newCommunities = {
          type: extraType,
          extra: extraData,
          _isExtra: true, // Thêm flag để dễ nhận biết khi map
          id: `extra-${page}-${Date.now()}`, // Key duy nhất
        };

        // TÍNH NGẪU NHIÊN:
        // Chọn 1 vị trí ngẫu nhiên từ index 2 đến index (chiều dài mảng - 1)
        // Công thức: Math.floor(Math.random() * (max - min + 1)) + min
        const minPos = 2;
        const maxPos = Math.max(minPos, newTweets.length - 2);
        const randomPos =
          Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos;

        combinedPageData.splice(randomPos, 0, _newCommunities);
      }

      if (page === 1) {
        setFeeds(combinedPageData);
      } else {
        setFeeds((prev) => {
          // Lọc trùng (chỉ lọc Tweet, bỏ qua các object Extra cũ)
          const existingTweetIds = new Set(
            prev
              .filter((item) => !(item as { _isExtra?: boolean })?._isExtra)
              .map((t) => t._id),
          );

          const filteredNewData = combinedPageData.filter(
            (item) => item._isExtra || !existingTweetIds.has(item._id),
          );

          return [...prev, ...filteredNewData];
        });
      }

      if (newTweets.length < 10) setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      console.log("Observer triggered, isIntersecting:", entry.isIntersecting);
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isLoadingMore &&
        feeds.length > 0
      ) {
        console.log("Loading more tweets...");
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [feeds?.length, hasMore, isLoading, isLoadingMore],
  );

  // Setup Intersection Observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) {
      console.error("observerRef is null, check if element is rendered");
      return;
    }

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

  // Reset khi feedType thay đổi
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
  }, [feedType]);

  // Thực hiện khi xoá bài viết thành công ở BE
  function onSuccessDel(id: string) {
    setFeeds((prev) => prev.filter((tw) => tw._id !== id));
  }

  // liêm đã đến đây
  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Loading state cho lần load đầu tiên */}
      {isLoading && page === 1 && <SkeletonTweet />}

      {/* Error state */}
      {error && (
        <ErrorResponse
          onRetry={() => {
            setPage(1);
            setFeeds([]);
            setHasMore(true);
            window.location.reload();
          }}
        />
      )}

      {/* Empty state */}
      {!isLoading && !error && feeds.length === 0 && page === 1 && <NotThing />}

      {/* Tweets list */}
      {feeds.length > 0 && (
        <div className="space-y-4">
          {feeds.map((item) => {
            const isTweet = Object.values(ETweetType).includes(item?.type);
            const communities = isTweet
              ? []
              : (item as unknown as { extra: ICommunity[] })?.extra;

            return isTweet ? (
              <TweetItem
                tweet={item}
                key={item._id}
                onSuccessDel={onSuccessDel}
              />
            ) : (
              !!communities.length && (
                <div key={communities[0]?._id}>
                  <p className="ml-4 mt-2 text-gray-500 font-medium">
                    Gợi ý tham gia
                  </p>
                  <div
                    className={cn(
                      "m-4 mt-2 grid grid-cols-3 items-center gap-x-3",
                    )}
                  >
                    {communities.map((com) => (
                      <CommunityShortRow community={com} key={com._id} />
                    ))}
                    <Link
                      to={"/communities/t/explore"}
                      className="animate-bounce duration-75"
                    >
                      <ButtonMain className="flex items-center ml-auto">
                        <span className="hidden lg:inline">Xem thêm</span>{" "}
                        <ArrowRight />
                      </ButtonMain>
                    </Link>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <SkeletonTweet count={2} />
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && feeds.length > 0 && user && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả nội dung!</p>
        </div>
      )}
    </div>
  );
};
