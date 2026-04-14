import { Plus, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import type { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ShortInfoProfile } from "~/components/short-info-profile";
import { DialogMain } from "~/components/ui/dialog";
import { useUserStore } from "~/store/useUserStore";
import { ReelPost } from "./reel-post";
import { useGetNewFeeds } from "~/apis/reel.api";
import { ErrorResponse } from "../state/error";
import { cn } from "~/utils/cn.util";

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

export function ReelItem({
  reel,
  isAuth = true,
  className,
}: {
  reel: IReel;
  isAuth?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  //
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hàm xử lý khi di chuột vào: Phát video
  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {
      // Trình duyệt có thể chặn autoplay nếu chưa có tương tác,
      // xử lý lỗi thầm lặng ở đây.
      console.log("Autoplay prevented");
    });
  };

  // Hàm xử lý khi di chuột ra: Dừng và reset video (tùy chọn)
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Quay lại từ đầu cho đẹp
    }
  };

  //
  function onclickReel() {
    navigate(`/reel/${reel._id}`, {
      state: { backgroundLocation: location },
    });
  }

  return (
    <Card
      className={cn(
        "h-50 p-0 overflow-hidden border-none relative group rounded-xl bg-gray-100",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={reel.video.url}
        muted={isMuted} // Bắt buộc phải muted thì mới auto-play mượt mà trên mọi trình duyệt
        loop // Lặp lại liên tục
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full object-contain transition-all duration-500 ease-out my-auto 
                   hover:scale-[1.05] hover:-translate-y-1 cursor-pointer"
        onClick={onclickReel}
      />

      {/* Button để bật/tắt âm thanh */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-2 right-2 z-20 p-1.5 bg-black/20 rounded-full text-white 
                   transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Avatar User */}
      {isAuth && (
        <ShortInfoProfile profile={reel.user}>
          <div
            className="absolute top-2 left-2 z-10 
                transition-all duration-500 ease-in-out
                opacity-100 group-hover:opacity-30 
                pointer-events-auto"
          >
            <img
              src={reel.user.avatar?.url || "/default-avatar.png"}
              alt={reel.user.name}
              className="w-8 h-8 border-2 border-white rounded-full object-cover cursor-pointer shadow-md"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn sự kiện click vào video
                navigate(`/${reel.user.username}`);
              }}
            />
          </div>
        </ShortInfoProfile>
      )}

      {/* Hiệu ứng lớp phủ nhẹ khi hover để avatar nổi bật hơn */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
    </Card>
  );
}

export function ReelItemSkeleton() {
  return (
    <Card className="p-0 h-50 overflow-hidden border-none relative group rounded-xl">
      {/* Video placeholder */}
      <div className="w-full h-[250px] bg-gray-200 animate-pulse relative">
        {/* Overlay nhẹ giống hover */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Avatar */}
      <div className="absolute top-2 left-2 z-10">
        <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse border-2 border-white shadow-md" />
      </div>

      {/* Button volume */}
      <div className="absolute bottom-2 right-2 z-20">
        <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
      </div>
    </Card>
  );
}
