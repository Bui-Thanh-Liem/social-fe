import { useEffect, useRef, useState } from "react";
import { useGetMultiCommunitiesOwner } from "~/apis/public/community.api";
import { NotThing } from "~/components/state/not-thing";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { SearchMain } from "~/components/ui/search";
import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/utils/cn.util";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import {
  CommunityShortRow,
  CommunityShortRowSkeleton,
} from "./community-short-row";
import { ErrorResponse } from "~/components/state/error";

const carouselItems = [
  "Tất cả",
  ...Object.values(EVisibilityType),
  ...Object.values(EMembershipType),
];

export function CommunityOwnerPage() {
  // Metadata
  useEffect(() => {
    document.title = "Cộng đồng của tôi";
  }, []);

  //
  const [page, setPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<ICommunity[]>([]);
  const total_page_ref = useRef(0);

  // Search, Carousel
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 800);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const debouncedCarouselVal = useDebounce(
    carouselItems[current] === "Tất cả" ? "" : carouselItems[current],
    1000,
  );

  //
  useEffect(() => {
    if (!api) return;

    // Lấy index hiện tại khi carousel được khởi tạo
    setCurrent(api.selectedScrollSnap());

    // Lắng nghe sự kiện khi carousel scroll
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  //
  const { data, isLoading, error, refetch } = useGetMultiCommunitiesOwner({
    limit: "20",
    qe: debouncedCarouselVal,
    page: page.toString(),
    q: debouncedSearchVal,
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && (debouncedSearchVal || debouncedCarouselVal)) {
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
  }, [debouncedCarouselVal, data, debouncedSearchVal, page]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setAllCommunities([]);
    };
  }, []);

  //
  function onPinnedCommunity(id: string) {
    setAllCommunities((prev) =>
      prev.map((item: any) => {
        if (item._id === id) {
          return { ...item, pinned: !item.pinned };
        }
        return item;
      }),
    );
  }

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div className="grid grid-cols-12 max-h-[calc(100vh-60px)] overflow-y-auto">
      <div className="col-span-0 xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10 min-h-[calc(100vh-120px)]">
        {/*  */}
        {allCommunities.length > 0 && (
          <div className="mb-4 flex items-center justify-between sticky top-0 z-10 py-3 bg-white">
            <div className="w-full lg:w-[40%]">
              <SearchMain
                size="sm"
                value={searchVal}
                onClear={() => setSearchVal("")}
                onChange={setSearchVal}
              />
            </div>

            <div className="w-[50%] hidden md:block">
              <Carousel setApi={setApi} className="w-[82%]">
                <CarouselContent className="-ml-1">
                  {carouselItems.map((_) => (
                    <CarouselItem key={_} className="pl-1">
                      <Card className="py-1 rounded-2xl border-gray-200">
                        <CardContent className="flex items-center justify-center">
                          <span className="text-[15px] font-medium">{_}</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
            </div>
          </div>
        )}

        <div>
          {/*  */}
          {!isLoading &&
            allCommunities.length === 0 &&
            page === 1 &&
            !error && <NotThing />}

          {error && (
            <ErrorResponse
              onRetry={() => {
                refetch();
              }}
            />
          )}

          {/* Loading lần đầu */}
          {isLoading && page === 1 && (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CommunityShortRowSkeleton key={`more-${i}`} />
              ))}
            </div>
          )}

          {/*  */}
          {allCommunities.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {sortCommunity(allCommunities).map((community) => (
                <CommunityShortRow
                  key={community._id}
                  community={community}
                  onTogglePinned={onPinnedCommunity}
                />
              ))}
            </div>
          )}

          {/* Loading khi load thêm */}
          {isLoading && page > 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <CommunityShortRowSkeleton key={`more-${i}`} />
              ))}
            </div>
          ) : (
            !!allCommunities.length && (
              <div className="py-3">
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
