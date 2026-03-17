import { Annoyed, Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetTrending, useReportTrending } from "~/apis/useFetchTrending";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/WrapIcon";
import { cn } from "~/lib/utils";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import { handleResponse } from "~/utils/toast";

export function TrendingItemSkeleton() {
  return (
    <div className="px-4 py-2 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          {/* Hashtag giả */}
          <div className="h-3 w-16 bg-gray-200 rounded" />
          {/* Text giả */}
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        {/* Icon giả */}
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function TrendingItem({ item, idx }: { item: ITrending; idx: number }) {
  const { topic, hashtag } = item;

  const [isReport, setIsReport] = useState(false);

  const apiReportTrending = useReportTrending();

  //
  async function handleReport() {
    if (isReport) return;
    const res = await apiReportTrending.mutateAsync({ trending_id: item._id });
    handleResponse(res, () => {
      setIsReport(true);
    });
  }

  return (
    <div key={item._id} className="hover:bg-gray-200 px-4 py-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {`${idx} `}. {(item.hashtag as unknown as IHashtag)?.name}
          </p>
          <Link
            to={
              topic
                ? `/search?q=${topic.replace("#", "")}`
                : `/hashtag/${(hashtag as unknown as IHashtag)?._id}`
            }
            className="text-sm leading-snug font-semibold line-clamp-1 hover:underline"
          >
            {item.topic}
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-0 outline-transparent">
              <WrapIcon>
                <Ellipsis size={20} />
              </WrapIcon>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            className="rounded-2xl py-2"
          >
            <DropdownMenuItem
              className={cn(
                "cursor-pointer px-4 font-semibold",
                isReport ? "pointer-events-none" : "",
              )}
              onClick={handleReport}
            >
              <Annoyed
                strokeWidth={2}
                className="w-3 h-3"
                color="var(--color-red-400)"
              />
              <p className="text-red-400 text-sm">
                {isReport ? "Bạn đã báo cáo" : "Báo cáo spam"}
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Trending() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [trending, setTrending] = useState<ITrending[]>([]);

  const total_page_ref = useRef(0);
  const { data, isLoading } = useGetTrending({
    page: page.toString(),
    limit: "20",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;
    if (items) {
      setTrending((prev) => [...prev, ...items]);
    }
  }, [data]);

  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  // Scroll to top khi có hash #outstanding-this-week
  useEffect(() => {
    if (window.location.hash === "#outstanding-this-week") {
      const el = document.getElementById("outstanding-this-week");

      if (el) {
        setTimeout(() => {
          console.log("Tiến hành scroll");

          // Debug: Kiểm tra lại offsetTop sau timeout
          console.log("Element offsetTop after timeout:", el.offsetTop);

          //
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }, 200);
      } else {
        console.log("Element not found!");
      }
    }
  }, [location.hash]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setTrending([]);
    };
  }, []);
  return (
    <div className="bg-gray-100 rounded-2xl sticky top-20">
      <p className="px-4 py-2 font-semibold">Xu hướng</p>

      {/*  */}
      <div className="h-[calc(100vh-228px)] overflow-y-auto scrollbar-hide">
        {trending?.map((item, idx) => (
          <TrendingItem key={item._id} item={item} idx={idx + 1} />
        ))}
        {/*  */}
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <TrendingItemSkeleton key={`more-${i}`} />
            ))
          : !!trending.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_ref.current <= page
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : "",
                  )}
                  onClick={onSeeMore}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {!trending.length && !isLoading && (
          <div className="flex justify-center items-center mt-20">
            <p className="text-gray-400">Chưa có sự từ khóa nổi bật</p>
          </div>
        )}
      </div>
      <div className="h-2"></div>
    </div>
  );
}
