import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TabsContent } from "~/components/ui/tabs";
import { useGetTrending } from "~/apis/useFetchTrending";
import { cn } from "~/lib/utils";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import { TrendingItem, TrendingItemSkeleton } from "./TrendingItem";

export function TrendingTab() {
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
    <TabsContent
      value="trending"
      className="px-4 pb-4 overflow-y-auto h-[calc(100vh-140px)]"
    >
      {/*  */}
      <div>
        {trending?.map((item, idx) => (
          <TrendingItem key={item._id} item={item} idx={idx + 1} />
        ))}
      </div>

      {/*  */}
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) => (
            <TrendingItemSkeleton key={`more-${i}`} />
          ))
        : !!trending.length && (
            <div className="px-4 py-3">
              <p
                className={cn(
                  "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                  total_page_ref.current <= page
                    ? "text-gray-300 pointer-events-none cursor-default"
                    : ""
                )}
                onClick={onSeeMore}
              >
                Xem thêm
              </p>
            </div>
          )}

      {!trending.length && !isLoading && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-400">Chưa có sự kiện gì nổi bật</p>
        </div>
      )}
    </TabsContent>
  );
}