import { useNavigate } from "react-router-dom";
import { cn } from "~/lib/utils";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";
import { useTrendingStore } from "~/store/useTrendingStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatTimeAgo } from "~/utils/date-time";

export function TodayNewsOrOutstandingItemSkeleton() {
  return (
    <div className="px-4 py-2 cursor-pointer">
      <div className="flex-1 animate-pulse">
        {/* title */}
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>

        {/* avatars + info */}
        <div className="flex items-center gap-2 mt-1">
          {/* avatars */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          </div>

          {/* text */}
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function TodayNewsOrOutstandingItem({
  item,
  isMedia = false,
}: {
  item: IResTodayNewsOrOutstanding;
  isMedia?: boolean;
}) {
  const navigate = useNavigate();
  const { setTrendingItem } = useTrendingStore();

  //
  function onClick() {
    setTrendingItem(item);
    navigate("/trending");
  }

  //
  const highlight = item.highlight;

  //
  return (
    <div
      key={item.id}
      className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex justify-between gap-3"
      onClick={onClick}
    >
      <div className="flex-1">
        <p
          className={cn(
            "text-sm leading-snug font-semibold",
            !isMedia ? "line-clamp-1" : "line-clamp-3"
          )}
        >
          {highlight[0].content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
            {highlight?.map((h, i) => (
              <Avatar key={`${h.avatar}-${i}`} className="w-6 h-6">
                <AvatarImage
                  alt={h.content}
                  src={h.avatar?.url || "/favicon.png"}
                />
                <AvatarFallback>{item.category[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatTimeAgo(item.time as unknown as string)} · {item.category} ·{" "}
            {item.posts} bài đăng
          </p>
        </div>
      </div>
      {isMedia && (
        <div className="w-32 h-20">
          {item.media?.file_type.includes("video/") ? (
            <video
              src={item.media.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : item.media?.file_type.includes("image/") ? (
            <img
              src={item.media.url}
              alt={item.media.url}
              className="object-contain w-full h-full"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png"; // Fallback image
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">Định dạng không hỗ trợ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
