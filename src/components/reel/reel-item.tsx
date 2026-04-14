import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShortInfoProfile } from "~/components/short-info-profile";
import { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { useReelStore } from "~/store/useReelStore";
import { cn } from "~/utils/cn.util";
import { Card } from "../ui/card";

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
  const { setReel } = useReelStore();

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
    setReel(reel);
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
        className="w-full h-full object-contain transition-all duration-500 ease-out my-auto 
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
