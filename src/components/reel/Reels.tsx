import { Plus, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { toastSimple } from "~/utils/toast";
import { ShortInfoProfile } from "~/components/ShortInfoProfile";
import { DialogMain } from "~/components/ui/dialog";
import { ReelPost } from "./reelPost";
import { useUserStore } from "~/store/useUserStore";

export function Reels() {
  const reels = Array.from({ length: 6 })?.map(
    (_, index) =>
      ({
        id: `reel-${index}`,
        video: {
          url: "/335326.mp4",
        },
        user: {
          avatar: { url: "/no-media.jpg", s3_key: "" },
          name: "Default User",
          username: "@liem_bui_thanh",
        },
      }) as any as IReel,
  );
  //
  const { user } = useUserStore();

  //
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  //
  function onClickAdd() {
    setIsOpenAdd(true);
  }

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
                  className="basis-1/4 md:basis-1/5 lg:basis-1/6 pt-2 pb-2"
                >
                  <Card className="p-0 overflow-hidden border-none relative group rounded-xl h-full bg-gray-100">
                    <CardContent
                      className="h-full flex cursor-pointer"
                      onClick={onClickAdd}
                    >
                      <Plus className="m-auto" size={34} color="#333" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
              {reels?.map((reel, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/4 md:basis-1/5 lg:basis-1/6 pt-2 pb-2"
                >
                  <ReelItem reel={reel} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 disabled:hidden" />
            <CarouselNext className="right-2 disabled:hidden" />
          </Carousel>
        </div>
      </div>

      <DialogMain isLogo={false} open={isOpenAdd} onOpenChange={setIsOpenAdd}>
        <ReelPost />
      </DialogMain>
    </>
  );
}

export function ReelItem({ reel }: { reel: IReel }) {
  const navigate = useNavigate();
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
  function onClick() {
    toastSimple("Tính năng đang được phát triển", "info");
  }

  return (
    <Card className="p-0 overflow-hidden border-none relative group rounded-xl bg-gray-100">
      <video
        ref={videoRef}
        src={reel.video.url}
        muted={isMuted} // Bắt buộc phải muted thì mới auto-play mượt mà trên mọi trình duyệt
        loop // Lặp lại liên tục
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full object-contain transition-all duration-500 ease-out 
                   hover:scale-[1.05] hover:-translate-y-1 cursor-pointer"
        onClick={onClick} // Ví dụ: click để xem chi tiết
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

      {/* Hiệu ứng lớp phủ nhẹ khi hover để avatar nổi bật hơn */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
    </Card>
  );
}

export function ReelItemSkeleton() {
  return (
    <Card className="p-0 overflow-hidden border-none relative group rounded-xl">
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
