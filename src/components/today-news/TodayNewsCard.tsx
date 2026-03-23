import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetTodayNews } from "~/apis/useFetchTrending";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

  //
  const news = useMemo(
    () => data?.metadata?.slice(0, 3) || [],
    [data?.metadata],
  );

  //
  if (!data?.metadata?.length) return null;

  //
  return (
    <Card className={cn("w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2")}>
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Tin tức hôm nay</CardTitle>
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
            <p className="text-gray-400 text-[14px]">
              Chưa có gì nổi bật hôm nay
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
