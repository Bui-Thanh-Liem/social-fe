import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetTodayNews } from "~/apis/useFetchTrending";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WrapIcon } from "../WrapIcon";
import {
  TodayNewsOrOutstandingItem,
  TodayNewsOrOutstandingItemSkeleton,
} from "../TodayNewsOrOutstanding-item";

export function TodayNewsCard() {
  //
  const { data, isLoading } = useGetTodayNews({
    page: "1",
    limit: "4",
  });

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const news = useMemo(
    () => data?.metadata?.slice(0, 3) || [],
    [data?.metadata],
  );

  useEffect(() => {
    setOpen(window.location.hash !== "#news-today");
  }, [location]);

  return (
    <Card
      className={cn(
        "w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2",
        open ? "" : "hidden",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Tin tức hôm nay</CardTitle>
        <WrapIcon>
          <X className="h-4 w-4" onClick={() => setOpen(false)} />
        </WrapIcon>
      </CardHeader>

      <CardContent className="px-0">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <TodayNewsOrOutstandingItemSkeleton key={`more-${i}`} />
            ))
          : news.map((item) => (
              <TodayNewsOrOutstandingItem key={item.id} item={item} />
            ))}

        {/*  */}
        {news.length > 0 && (
          <div className="hover:bg-gray-100 px-4 py-3">
            <div>
              <Link to="/explore#news-today">
                <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
                  Xem thêm
                </p>
              </Link>
            </div>
          </div>
        )}

        {!news.length && !isLoading && (
          <div className="pb-4 pl-4">
            <p className="text-gray-400">Chưa có gì nổi bật hôm nay</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
