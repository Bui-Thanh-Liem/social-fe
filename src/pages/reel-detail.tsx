import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetNewFeeds } from "~/apis/reel.api";
import { ShortInfoProfile } from "~/components/short-info-profile";
import { AvatarMain } from "~/components/ui/avatar";
import { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { IUser } from "~/shared/interfaces/schemas/user.interface";
import { cn } from "~/utils/cn.util";
import { formatTimeAgo } from "~/utils/date-time";

export function ReelDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  //
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  //
  const [feeds, setFeeds] = useState<IReel[]>([]);

  //
  const { data, isLoading, error, refetch } = useGetNewFeeds({
    page: "1",
    limit: "10",
  });

  //
  useEffect(() => {
    if (data?.metadata?.items) {
      setFeeds(data.metadata.items as IReel[]);
    }
  }, [data]);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {
      // Trình duyệt có thể chặn autoplay nếu chưa có tương tác,
      // xử lý lỗi thầm lặng ở đây.
      console.log("Autoplay prevented");
    });
  };

  //
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    // Nếu click vào vùng không được close → bỏ qua
    const target = e.target as HTMLElement;
    if (target.closest(".not-close")) return;
    e.stopPropagation();

    // KIỂM TRA: Nếu có backgroundLocation tức là họ mở từ Feed -> Back lại là an toàn
    if (location.state?.backgroundLocation) {
      navigate(-1);
    } else {
      // Nếu không có state (vào trực tiếp bằng link) -> Đẩy về trang chủ
      navigate("/", { replace: true });
    }
  };

  const reel = feeds[0]; // Lấy reel đầu tiên để hiển thị, bạn có thể điều chỉnh logic này tùy theo nhu cầu
  const author = reel?.user as unknown as IUser;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/60 grid grid-cols-3 items-center"
    >
      <div className="not-close col-span-1"></div>
      <div className="not-close relative col-span-1 bg-gray-50 h-[90vh] rounded-2xl overflow-hidden group">
        <video
          loop
          ref={videoRef}
          muted={isMuted}
          src={reel?.video.url}
          onMouseEnter={handleMouseEnter}
          className="w-full h-full object-contain"
        />

        <div
          className="absolute text-white bg-black/20 bottom-0 left-0 w-full px-5 py-3
            opacity-0 translate-y-2 
            transition-all duration-300 ease-out
            group-hover:opacity-100 group-hover:translate-y-0"
        >
          <div className="flex items-center">
            <AvatarMain
              src={author?.avatar?.url}
              alt={author?.name}
              className={cn(
                "mr-3",
                author?.isPinnedReel ? "ring-2 ring-sky-400" : "",
              )}
            />
            <div>
              <ShortInfoProfile profile={author as unknown as IUser}>
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
                {formatTimeAgo(reel?.created_at as unknown as string)}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="ml-auto p-2 bg-black/20 rounded-full text-white cursor-pointer
                   transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          <p className="text-sm">{reel?.content}</p>
        </div>
      </div>
      <div className="not-close col-span-1"></div>
    </div>
  );
}
