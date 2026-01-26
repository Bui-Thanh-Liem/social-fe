import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  TodayNewsOrOutstandingItem,
  TodayNewsOrOutstandingItemSkeleton,
} from "~/components/TodayNewsOrOutstanding-item";
import { useGetOutstandingThisWeek } from "~/apis/useFetchTrending";
import { cn } from "~/lib/utils";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";
import { toastSimple } from "~/utils/toast";

export function OutstandingThisWeek() {
  const location = useLocation();
  const [limit, setLimit] = useState(4);

  const [outstanding, setOutstanding] = useState<IResTodayNewsOrOutstanding[]>(
    [],
  );
  const countWarning = useRef(0);

  //
  const { data, isLoading } = useGetOutstandingThisWeek(
    {
      page: "1",
      limit: limit.toString(),
    },
    countWarning.current <= 3,
  );

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata || [];
    if (items.length > 0) {
      setOutstanding((prev) => {
        // Create a Set of existing IDs for quick lookup
        const existingIds = new Set(prev.map((item) => item.id));
        // Filter out items that already exist in the state
        const newItems = items.filter((item) => !existingIds.has(item.id));

        // Check if no new items were added
        if (newItems.length === 0) {
          countWarning.current += 1;
        }

        return [...prev, ...newItems];
      });
    }
  }, [data]);

  //
  useEffect(() => {
    if (countWarning.current >= 3) {
      toastSimple("Đã tìm kiếm hết tất cả tin tức hôm nay.");
    }
  }, [countWarning.current]);

  //
  function onSeeMore() {
    setLimit((prev) => prev + 20);
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
      setLimit(4);
      setOutstanding([]);
    };
  }, []);

  //
  return (
    <>
      <a
        id="outstanding-this-week"
        className="block"
        style={{
          scrollMarginTop: "80px",
        }}
      />
      <p className="text-xl font-bold mt-4 py-2 bg-gray-50 sticky top-0 z-30">
        Nổi bật trong tuần
      </p>

      {/*  */}
      <div>
        {outstanding?.map((item) => (
          <TodayNewsOrOutstandingItem key={item.id} item={item} isMedia />
        ))}
      </div>

      {/*  */}
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) => (
            <TodayNewsOrOutstandingItemSkeleton key={`more-${i}`} />
          ))
        : !!outstanding.length && (
            <div className="px-4 py-3">
              <p
                className={cn(
                  "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                  countWarning.current <= 3
                    ? "text-gray-300 pointer-events-none cursor-default"
                    : "",
                )}
                onClick={onSeeMore}
              >
                Xem thêm
              </p>
            </div>
          )}

      {!outstanding.length && !isLoading && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-400">Chưa có sự kiện gì nổi bật</p>
        </div>
      )}
    </>
  );
}
