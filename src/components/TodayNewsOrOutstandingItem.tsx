import { useNavigate } from "react-router-dom";
import { cn } from "~/lib/utils";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";
import { useTrendingStore } from "~/store/useTrendingStore";
import { formatTimeAgo } from "~/utils/dateTime";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

export function TodayNewsOrOutstandingItemSkeleton({
  shape = "row",
}: {
  shape?: "row" | "card";
}) {
  // Skeleton cho dạng ROW
  if (shape === "row") {
    return (
      <div className="px-4 py-2 flex justify-between gap-3 animate-pulse">
        <div className="flex-1">
          {/* Giả lập Title */}
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>

          {/* Giả lập Avatar Group + Info */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white"
                ></div>
              ))}
            </div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
        {/* Giả lập Media vuông bên phải */}
        <div className="w-32 h-20 bg-gray-100 rounded-md"></div>
      </div>
    );
  }

  // Skeleton cho dạng CARD (Có ảnh nền)
  return (
    <Card className="relative min-h-48 w-full overflow-hidden animate-pulse bg-gray-100 border-none">
      {/* Overlay giả lập để text nổi lên giống card thật */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      <CardContent className="absolute top-24 w-full">
        {/* Giả lập CardTitle (2 dòng) */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
        </div>

        {/* Giả lập Avatar Group */}
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-100"
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TodayNewsOrOutstandingItem({
  item,
  shape = "row",
  isMedia = false,
}: {
  isMedia?: boolean;
  shape?: "row" | "card";
  item: IResTodayNewsOrOutstanding;
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
  if (shape === "row")
    return (
      <div
        key={item.id}
        className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex justify-between gap-3"
        onClick={onClick}
      >
        <div className="flex-1">
          <p
            className={cn(
              "text-sm leading-snug font-semibold break-words [word-break:break-word] [hyphens:auto]",
              !isMedia ? "line-clamp-1" : "line-clamp-3",
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
              {formatTimeAgo(item.time as unknown as string)} · {item.category}{" "}
              · {item.posts} bài đăng
            </p>
          </div>
        </div>
        {isMedia &&
          (item.media?.url ? (
            <div className="w-32 h-20">
              {item.media?.file_type?.includes("video/") ? (
                <video
                  src={item.media?.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : item.media?.file_type?.includes("image/") ? (
                <img
                  src={item.media?.url}
                  alt={item.media?.url}
                  className="object-contain w-full h-full"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/favicon.png"; // Fallback image
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">Định dạng không hỗ trợ</p>
                </div>
              )}
            </div>
          ) : null)}
      </div>
    );

  return (
    <Card
      style={{
        backgroundImage: item.media?.url
          ? `url(${item.media?.url})`
          : "url(/no-media.jpg)",
      }}
      onClick={onClick}
      className="relative min-h-48"
    >
      <CardContent className=" cursor-pointer absolute top-24">
        <CardTitle className="line-clamp-3 text-white mb-2 hover:underline">
          {highlight[0].content}
        </CardTitle>
        <CardDescription>
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
        </CardDescription>
      </CardContent>
    </Card>
  );
}
