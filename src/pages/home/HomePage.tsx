import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllPinnedBareCommunities } from "~/apis/useFetchCommunity";
import { Card } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EFeedType } from "~/shared/enums/type.enum";
import type { IReel } from "~/shared/interfaces/schemas/reel.interface";
import { useReloadStore } from "~/store/useReloadStore";
import { ListTweets } from "../../components/list-tweets/ListTweets";
import { CommunityTweets } from "../community/Community-page/CommunityTweets";

export function HomePage() {
  // Metadata
  useEffect(() => {
    document.title = "Mạng xã hội (DEV)";
  }, []);

  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  //
  const [communityId, setCommunityId] = useState<string>("");
  const [valueSelect, setValueSelect] = useState<string>(`/`);

  //
  const { triggerReload, reloadKey } = useReloadStore();

  //
  const { data } = useGetAllPinnedBareCommunities();
  const pinnedCommunities = data?.metadata || [];

  //
  const containerRef = useRef<HTMLDivElement>(null);

  //
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = 0; // scroll lên đầu container
  }, [reloadKey]);

  //
  useEffect(() => {
    setValueSelect(hash || "/");
  }, [hash]);

  //
  const navigation = [
    {
      name: "Dành Cho Bạn",
      value: "/",
    },
    {
      name: "Đã Theo Dõi",
      value: `#${EFeedType.Following}`,
    },
    ...pinnedCommunities.map((community) => ({
      name: community.name,
      value: `#${community.slug}`,
    })),
  ];

  //
  function handleClickNav(value: string) {
    triggerReload();
    setValueSelect(value);

    const selectedCommunity = pinnedCommunities.find(
      (community) => `#${community.slug}` === value,
    );
    const communityId = selectedCommunity?._id || "";
    setCommunityId(communityId);
    navigate(value === "/" ? pathname : `${pathname}${value}`);
  }

  return (
    <main className="relative grid grid-cols-12 pt-3 ">
      <div className="col-span-0 xl:col-span-2 pr-4">
        <Reel />
      </div>
      <div
        ref={containerRef}
        className="col-span-12 xl:col-span-10 h-[calc(100vh-70px)] overflow-y-auto"
      >
        {/* Fixed Navigation Bar */}
        <Select
          value={valueSelect}
          onValueChange={handleClickNav}
          defaultValue={navigation[0].value}
        >
          <SelectTrigger
            id="nav"
            size="sm"
            className="border-0 outline-0 focus:bg-white bg-white min-w-60 mb-3"
          >
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {navigation.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Scrollable Content */}
        {Object.values(EFeedType).includes(formatTypeText(hash)) ? (
          <ListTweets feedType={formatTypeText(hash)} />
        ) : (
          <div className="space-y-4">
            <CommunityTweets community_id={communityId} />
          </div>
        )}
      </div>
    </main>
  );
}

function Reel() {
  const reels = Array.from({ length: 4 })?.map(
    (_, index) =>
      ({
        id: `reel-${index}`,
        videoUrl: "/335326.mp4",
        user: {
          avatar: { url: "/no-media.jpg", s3_key: "" },
          name: "Default User",
          username: "@liem_bui_thanh",
        },
      }) as any as IReel,
  );

  return (
    <div className="h-[calc(100vh-80px)] hidden lg:flex">
      <div className="h-[60%] overflow-y-auto scrollbar-hide my-auto relative [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <Carousel orientation="vertical" className="w-full">
          <CarouselContent>
            {reels?.map((reel, index) => (
              <CarouselItem key={index} className="basis-1/2 pt-2 pb-2">
                <ReelItem reel={reel} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

function ReelItem({ reel }: { reel: IReel }) {
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

  return (
    <Card className="p-0 overflow-hidden border-none relative group rounded-xl">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        muted={isMuted} // Bắt buộc phải muted thì mới auto-play mượt mà trên mọi trình duyệt
        loop // Lặp lại liên tục
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full object-contain rounded-xl transition-all duration-500 ease-out 
                   hover:scale-[1.05] hover:-translate-y-1 cursor-pointer"
        // onClick={() => navigate(`/reels/${reel.id}`)} // Ví dụ: click để xem chi tiết
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
      <div
        className="absolute top-2 left-2 z-10 
                transition-all duration-500 ease-in-out
                opacity-100 group-hover:opacity-0 
                pointer-events-auto group-hover:pointer-events-none"
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

      {/* Hiệu ứng lớp phủ nhẹ khi hover để avatar nổi bật hơn */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
    </Card>
  );
}

function formatTypeText(type: any) {
  switch (type) {
    case `#${EFeedType.Everyone}`:
      return EFeedType.Everyone;
    case `#${EFeedType.Following}`:
      return EFeedType.Following;
    case ``:
      return EFeedType.All;
    default:
      return type?.replace("#", "");
  }
}
