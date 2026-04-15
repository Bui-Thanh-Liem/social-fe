import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetNewFeeds } from "~/apis/reel.api";
import { ShortInfoProfile } from "~/components/short-info-profile";
import { AvatarMain } from "~/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { WrapIcon } from "~/components/wrap-icon";
import { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useReelStore } from "~/store/useReelStore";
import { cn } from "~/utils/cn.util";
import { formatTimeAgo } from "~/utils/date-time";

export function ReelDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { reel } = useReelStore();

  const [isMuted, setIsMuted] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [feeds, setFeeds] = useState<IReel[]>([]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const wheelPlugin = useRef(
    WheelGesturesPlugin({
      forceWheelAxis: "y",
    }),
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { data } = useGetNewFeeds({
    page: page.toString(),
    limit: "10",
  });

  // Khi có data mới từ API, nối nó vào mảng feeds cũ thay vì thay thế hoàn toàn
  useEffect(() => {
    if (!data?.metadata?.items) return;

    const newItems = data.metadata.items as IReel[];

    if (newItems.length < 10) {
      setHasMore(false);
    }

    setFeeds((prev) => {
      // Nếu là trang 1: Xử lý logic chèn Reel từ Store lên đầu
      if (page === 1) {
        let finalFirstPage = newItems;
        if (reel) {
          const filteredApiFeeds = newItems.filter(
            (item) => item._id !== reel._id,
          );
          finalFirstPage = [reel, ...filteredApiFeeds];
        }
        return finalFirstPage;
      }

      // Nếu là trang > 1: Nối mảng và lọc trùng ID
      const existingIds = new Set(prev.map((i) => i._id));
      const filteredNewItems = newItems.filter((i) => !existingIds.has(i._id));
      return [...prev, ...filteredNewItems];
    });

    setIsFetchingNextPage(false);
  }, [data, page, reel]);

  //
  useEffect(() => {
    if (data?.metadata?.items) {
      const apiFeeds = data.metadata.items as IReel[];

      if (reel) {
        try {
          // QUAN TRỌNG: Lọc bỏ reel từ API nếu nó trùng id với reel ở localStorage
          const filteredApiFeeds = apiFeeds.filter(
            (item) => item._id !== reel._id,
          );

          // Đẩy reel từ localStorage lên đầu mảng
          setFeeds([reel, ...filteredApiFeeds]);

          // Xóa khỏi localStorage sau khi đã dùng để không bị dính cho các lần mở sau
          localStorage.removeItem("selectedReel");
        } catch (error) {
          console.error("Lỗi parse JSON từ localStorage", error);
          // Nếu lỗi thì cứ dùng data từ API như bình thường
          setFeeds(apiFeeds);
        }
      } else {
        // Không có dữ liệu trong localStorage thì dùng API
        setFeeds(apiFeeds);
      }
    }
  }, [data]);

  // Khi chọn reel mới (chuyển slide), cập nhật URL và quản lý phát video
  useEffect(() => {
    if (!api || feeds.length === 0) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      currentIndexRef.current = index;

      // 1. Xử lý URL (giữ nguyên)
      const currentReel = feeds[index];
      if (currentReel?._id) {
        window.history.replaceState(null, "", `/reel/${currentReel._id}`);
      }

      // 2. QUẢN LÝ PHÁT VIDEO:
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        if (i === index) {
          // Video hiện tại: Phát
          video.play().catch((err) => console.log("Autoplay blocked:", err));
        } else {
          // Các video khác: Dừng và đưa về đầu
          video.pause();
          video.currentTime = 0;
        }
      });

      // 3. Logic gọi API trang mới (giữ nguyên)
      if (index >= feeds.length - 2 && !isFetchingNextPage && hasMore) {
        setIsFetchingNextPage(true);
        setPage((prev) => prev + 1);
      }
    };

    api.on("select", onSelect);
    // Gọi lần đầu để phát video đầu tiên khi mới mount
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api, feeds.length, isFetchingNextPage, hasMore]);

  // Nếu không có reel nào để hiển thị
  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.play().catch(() => {
      console.log("Autoplay prevented");
    });
    setIsMuted(false);
  };

  // Khi click vào video, tạm dừng nó (không ảnh hưởng đến video khác)
  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.pause();
  };

  // Đóng modal khi click ra ngoài
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".not-close")) return;
    e.stopPropagation();

    if (location.state?.backgroundLocation) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleNext = () => {
    if (api) {
      console.log("Scrolling next...");
      api.scrollNext();
    } else {
      console.log("API not ready");
    }
  };

  const handlePrev = () => {
    if (api) {
      console.log("Scrolling prev...");
      api.scrollPrev();
    } else {
      console.log("API not ready");
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/60 grid grid-cols-1 lg:grid-cols-3 items-center"
    >
      <div className="not-close col-span-0 lg:col-span-1"></div>
      <div className="col-span-1 lg:col-span-2 relative">
        <Carousel
          orientation="vertical"
          setApi={setApi}
          plugins={[wheelPlugin.current]}
          opts={{
            align: "start",
            loop: false,
            axis: "y", // Đảm bảo trục cuộn là Y
          }}
        >
          <CarouselContent className="w-full h-[92vh] lg:w-1/2">
            {feeds.map((item, index) => {
              const reel = item as unknown as IReel;
              const author = reel.user as unknown as IUser;

              return (
                <CarouselItem key={item._id} className="h-screen">
                  <div className="not-close relative bg-gray-50 h-[90vh] rounded-2xl overflow-hidden group">
                    <video
                      loop
                      muted={isMuted}
                      src={reel?.video.url}
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      onClick={() => handleClick(index)}
                      className="w-full h-full object-contain"
                      onMouseEnter={() => handleMouseEnter(index)}
                    />

                    <div
                      className="absolute text-white bg-black/20 top-0 left-0 w-full px-5 py-3
                                  opacity-0 -translate-y-2
                                  transition-all duration-300 ease-out
                                  group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      <div className="flex items-center">
                        <AvatarMain
                          src={reel?.user.avatar?.url}
                          alt={reel?.user.name}
                          className={cn(
                            "mr-3",
                            author?.isPinnedReel ? "ring-2 ring-sky-400" : "",
                          )}
                        />
                        <div>
                          <ShortInfoProfile
                            profile={author as unknown as IUser}
                          >
                            <Link
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              to={`/${author?.username}`}
                              className="flex items-center gap-2"
                            >
                              <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                                {author?.name}
                              </h3>
                            </Link>
                          </ShortInfoProfile>
                          <p className="text-sm">
                            {author?.username} •{" "}
                            {formatTimeAgo(
                              reel?.created_at as unknown as string,
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{reel?.content}</p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <div className="not-close h-12 w-12 absolute top-1/3 z-10 right-1/3 space-y-6 hidden lg:block">
          <WrapIcon onClick={handlePrev}>
            <ArrowUp size={32} />
          </WrapIcon>

          <WrapIcon onClick={handleNext}>
            <ArrowDown size={32} />
          </WrapIcon>
        </div>
      </div>
    </div>
  );
}
