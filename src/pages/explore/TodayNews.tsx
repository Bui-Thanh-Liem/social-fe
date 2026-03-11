import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetTodayNews } from "~/apis/useFetchTrending";
import {
  TodayNewsOrOutstandingItem,
  TodayNewsOrOutstandingItemSkeleton,
} from "~/components/TodayNewsOrOutstanding-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";

export function TodayNews() {
  const location = useLocation();
  const [news, setNews] = useState<IResTodayNewsOrOutstanding[]>([]);

  //
  const { data, isLoading } = useGetTodayNews({
    page: "1",
    limit: "40",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata || [];
    if (items.length > 0) {
      setNews((prev) => {
        // Create a Set of existing IDs for quick lookup
        const existingIds = new Set(prev.map((item) => item.id));
        // Filter out items that already exist in the state
        const newItems = items.filter((item) => !existingIds.has(item.id));

        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // Scroll to top khi có hash #news-today
  useEffect(() => {
    if (window.location.hash === "#news-today") {
      const el = document.getElementById("news-today");

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
  return (
    <div className="mb-4">
      <a
        id="news-today"
        className="block"
        style={{
          scrollMarginTop: "80px",
        }}
      />
      <p className="text-xl font-bold py-2 bg-gray-50 sticky top-0 z-20">
        Tin tức hôm nay
      </p>

      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {/*  */}
          {news.map((item) => (
            <CarouselItem key={item.id} className="basis-1/2 lg:basis-1/3">
              <TodayNewsOrOutstandingItem isMedia shape="card" item={item} />
            </CarouselItem>
          ))}

          {/*  */}
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <CarouselItem
                key={`more-${i}`}
                className="basis-1/2 lg:basis-1/3"
              >
                <TodayNewsOrOutstandingItemSkeleton shape="card" />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 disabled:hidden" />
        <CarouselNext className="right-2 disabled:hidden" />
      </Carousel>

      {/*  */}
      {!news.length && !isLoading && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-400 text-[14px]">
            Chưa có gì nổi bật hôm nay
          </p>
        </div>
      )}
    </div>
  );
}
