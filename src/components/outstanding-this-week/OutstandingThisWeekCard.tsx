import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetOutstandingThisWeek } from "~/apis/useFetchTrending";
import { cn } from "~/lib/utils";
import {
  TodayNewsOrOutstandingItem,
  TodayNewsOrOutstandingItemSkeleton,
} from "../TodayNewsOrOutstanding-item";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function OutstandingThisWeekCard() {
  //
  const { data, isLoading } = useGetOutstandingThisWeek({
    page: "1",
    limit: "4",
  });

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const outstanding = useMemo(
    () => data?.metadata?.slice(0, 3) || [],
    [data?.metadata],
  );

  //
  useEffect(() => {
    setOpen(window.location.hash !== "#outstanding-this-week");
  }, [location.hash]);

  //
  return (
    <Card
      className={cn(
        "w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2",
        open ? "" : "hidden",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Nổi bật trong tuần</CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        {/*  */}
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <TodayNewsOrOutstandingItemSkeleton key={`more-${i}`} />
            ))
          : outstanding.map((item) => (
              <TodayNewsOrOutstandingItem key={item.id} item={item} />
            ))}

        {/*  */}
        {outstanding.length > 0 && (
          <div className="hover:bg-gray-100 px-4 py-3">
            <Link to="/explore#outstanding-this-week">
              <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
                Xem thêm
              </p>
            </Link>
          </div>
        )}

        {/*  */}
        {!outstanding.length && !isLoading && (
          <div className="pb-4 pl-4">
            <p className="text-gray-400">Chưa có sự kiện gì nổi bật</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
