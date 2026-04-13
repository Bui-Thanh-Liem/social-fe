import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchCommunities } from "~/apis/search.api";
import { NotThing } from "~/components/state/not-thing";
import { UserToFollowItemSkeleton } from "~/components/who-to-follow/who-to-follow-item";
import { cn } from "~/utils/cn.util";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { CommunityRow } from "../community/community-row";

export function CommunityTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [page, setPage] = useState(1);
  const [communities, setCommunities] = useState<ICommunity[]>([]);

  const total_page_ref = useRef(0);
  const { data, isLoading, refetch, isFetching } = useSearchCommunities({
    page: page.toString(),
    limit: "10",
    q: q ?? "",
  });

  //
  useEffect(() => {
    setCommunities([]);
    setPage(1);
    refetch();
  }, [q]);

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (items) {
      setCommunities((prev) => [...prev, ...items]);
    }
  }, [data?.metadata]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setCommunities([]);
    };
  }, []);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  const loading = isLoading || isFetching;

  return (
    <div className="overflow-y-auto">
      {/*  */}
      <div>
        {communities.map((item) => (
          <CommunityRow key={item._id} community={item} />
        ))}
      </div>

      {/*  */}
      {loading
        ? Array.from({ length: 2 }).map((_, i) => (
            <UserToFollowItemSkeleton key={`more-${i}`} />
          ))
        : !!communities.length && (
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
          )}

      {/*  */}
      {!communities.length && !loading && (
        <NotThing
          type="search"
          description={`Không có cộng đồng phù hợp với "${q}"`}
        />
      )}
    </div>
  );
}
