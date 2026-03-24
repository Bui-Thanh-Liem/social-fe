import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetTodayNews } from "~/apis/useFetchTrending";
import { ErrorResponse } from "~/components/state/Error";
import { NotThing } from "~/components/state/NotThing";
import {
  TodayNewsOrOutstandingItem,
  TodayNewsOrOutstandingItemSkeleton,
} from "~/components/TodayNewsOrOutstandingItem";
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
  const { data, isLoading, error, refetch } = useGetTodayNews({
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

  console.log("TodayNewsOrOutstandingItem - item :::", news);

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

      <Carousel opts={{ align: "start" }} className="mt-4">
        <CarouselContent>
          {/*  */}
          {news.map((item) => (
            <CarouselItem key={item.id} className="basis-1/2 lg:basis-1/3">
              <TodayNewsOrOutstandingItem isMedia shape="card" item={item} />
            </CarouselItem>
          ))}

          {/*  */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
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

      {error && <ErrorResponse onRetry={() => refetch()} />}

      {/*  */}
      {!news.length && !isLoading && !error && <NotThing />}
    </div>
  );
}
