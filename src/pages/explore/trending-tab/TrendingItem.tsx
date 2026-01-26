import { Annoyed, Ellipsis, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/WrapIcon";
import { useReportTrending } from "~/apis/useFetchTrending";
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
  const navigate = useNavigate();

  const [isReport, setIsReport] = useState(false);

  const apiReportTrending = useReportTrending();

  //
  function handleSearch() {
    if (item?.topic) {
      navigate(`/search?q=${item.topic.replace("#", "")}`);
      return;
    }
    if (item?.hashtag)
      navigate(`/search?q=${(item.hashtag as unknown as IHashtag).name}`);
  }

  //
  async function handleReport() {
    if (isReport) return;
    const res = await apiReportTrending.mutateAsync({ trending_id: item._id });
    handleResponse(res, () => {
      setIsReport(true);
    });
  }

  return (
    <div key={item._id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {`${idx} `}. {(item.hashtag as unknown as IHashtag)?.name}
          </p>
          <p className="text-sm leading-snug font-semibold line-clamp-1">
            {item.topic}
          </p>
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
              className="cursor-pointer px-4 font-semibold"
              onClick={handleSearch}
            >
              <Search strokeWidth={2} className="w-3 h-3" color="#000" />
              <p className="text-sm">Tìm kiếm</p>
            </DropdownMenuItem>
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
