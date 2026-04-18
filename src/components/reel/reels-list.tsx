import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetNewFeeds } from "~/apis/reel.api";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { DialogMain } from "~/components/ui/dialog";
import type { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { useUserStore } from "~/storage/use-user.storage";
import { ErrorResponse } from "../state/error";
import { ReelItem, ReelItemSkeleton } from "./reel-item";
import { ReelPost } from "./reel-post";

export function ReelsList() {
  //
  const { user } = useUserStore();

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [feeds, setFeeds] = useState<IReel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, refetch } = useGetNewFeeds({
    page: page.toString(),
    limit: "10", // Giảm limit để load nhanh hơn
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.metadata?.items) {
      const newTweets = data.metadata.items as IReel[];

      const combinedPageData: any[] = [...newTweets];

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

  //
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  //
  function onClickAdd() {
    setIsOpenAdd(true);
  }

  if (feeds.length === 0 && !isLoading) return null;

  return (
    <>
      <div className="flex">
        <div className="my-auto relative [mask-image:linear-gradient(to_right,black_85%,transparent)]">
          <Carousel
            plugins={[WheelGesturesPlugin()]}
            opts={{
              // loop: true,
              align: "start",
            }}
            orientation="horizontal"
            className="w-full"
          >
            <CarouselContent>
              {user?._id && (
                <CarouselItem
                  key={"ssss"}
                  className="basis-1/3 md:basis-1/4 lg:basis-1/5 pt-2 pb-2"
                >
                  <Card className="p-0 overflow-hidden border-none relative group rounded-xl h-full bg-gray-50 border-4">
                    <CardContent
                      className="h-full flex cursor-pointer border-2 border-gray-200 m-.5 rounded-xl"
                      onClick={onClickAdd}
                    >
                      <Plus className="m-auto" size={34} color="#666" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}

              {/* Loading state cho lần load đầu tiên */}
              {isLoading && page === 1 && <ReelItemSkeleton />}

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

              {/*  */}
              {feeds?.map((reel, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 md:basis-1/4 lg:basis-1/5 pt-2 pb-2"
                >
                  <ReelItem reel={reel} />
                </CarouselItem>
              ))}

              {/* Loading more indicator */}
              {isLoadingMore && <ReelItemSkeleton />}

              {/*  */}
              <div ref={observerRef} className="h-10 w-1" />
            </CarouselContent>
            <CarouselPrevious className="left-2 disabled:hidden" />
            <CarouselNext className="right-2 disabled:hidden" />
          </Carousel>
        </div>
      </div>

      <DialogMain isLogo={false} open={isOpenAdd} onOpenChange={setIsOpenAdd}>
        <ReelPost
          onSuccess={() => {
            refetch();
            setIsOpenAdd(false);
          }}
        />
      </DialogMain>
    </>
  );
}
