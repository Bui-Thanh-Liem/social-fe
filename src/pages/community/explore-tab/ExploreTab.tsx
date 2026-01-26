import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  useGetAllCategories,
  useGetMultiCommunities,
} from "~/apis/useFetchCommunity";
import { cn } from "~/lib/utils";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { CommunityRow, CommunityRowSkeleton } from "../CommunityRow";

export function ExploreTab() {
  //
  const [searchParams] = useSearchParams();

  //
  const searchVal = searchParams.get("search");

  //
  const [page, setPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<ICommunity[]>([]);
  const total_page_ref = useRef(0);

  // Search, Carousel
  const [cate, setCate] = useState("");

  //
  const { data: cates } = useGetAllCategories();
  const { data, isLoading } = useGetMultiCommunities({
    qe: cate,
    limit: "10",
    q: searchVal || "",
    page: page.toString(),
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && (searchVal || cate)) {
      setAllCommunities(items);
    } else {
      setAllCommunities((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString()),
        );
        return [...newItems, ...prev];
      });
    }
  }, [data, searchVal, page, cate]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setAllCommunities([]);
    };
  }, []);

  //
  useEffect(() => {
    if (searchVal || cate) setPage(1);
  }, [searchVal, cate]);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div>
      {/*  */}
      <div className="flex mb-4 px-4">
        <Carousel className="group w-full">
          <CarouselContent className="-ml-1">
            {cates?.metadata?.map((_) => (
              <CarouselItem key={_} className="pl-1 md:basis-1/3 lg:basis-1/4">
                <Card
                  className={cn(
                    "py-1 rounded-2xl border border-gray-200 cursor-pointer",
                    _ === cate ? "border-sky-400" : "",
                  )}
                  onClick={() => setCate(_ === cate ? "" : _)}
                >
                  <CardContent className="flex items-center justify-center">
                    <span className="text-[15px] font-medium">{_}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-gray-100 w-10 h-10 -left-3 hidden group-hover:flex" />
          <CarouselNext className="bg-gray-100 w-10 h-10 -right-3 hidden group-hover:flex" />
        </Carousel>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {/*  */}
        {!isLoading && allCommunities.length === 0 && page === 1 && (
          <p className="mt-24 p-4 text-center text-gray-500">
            không tìm thấy cộng đồng.
          </p>
        )}

        {/* Loading lần đầu */}
        {isLoading && page === 1 && (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <CommunityRowSkeleton key={`more-${i}`} />
            ))}
          </div>
        )}

        {/*  */}
        {allCommunities.length > 0 && (
          <div>
            {sortCommunity(allCommunities)?.map((community) => (
              <CommunityRow key={community._id} community={community} />
            ))}
          </div>
        )}

        {/* Loading khi load thêm */}
        {isLoading && page > 1 ? (
          <div>
            {Array.from({ length: 2 }).map((_, i) => (
              <CommunityRowSkeleton key={`more-${i}`} />
            ))}
          </div>
        ) : (
          !!allCommunities.length && (
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
          )
        )}
      </div>
    </div>
  );
}

function sortCommunity(conversations: ICommunity[]) {
  return conversations.sort((a, b) => {
    // 1️⃣ Ưu tiên cộng đồng được pin (pinned: true)
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // 2️⃣ Nếu cả hai cùng pin hoặc cùng không pin → sắp theo updated_at (mới nhất trước)
    const aTime = new Date(a.updated_at ?? 0).getTime();
    const bTime = new Date(b.updated_at ?? 0).getTime();

    return bTime - aTime;
  });
}
