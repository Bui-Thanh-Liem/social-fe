import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/who-to-follow-item";
import { useSearchUsers } from "~/apis/useFetchSearch";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function PeopleTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");

  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const total_page_ref = useRef(0);
  const { data, isLoading, refetch, isFetching } = useSearchUsers({
    page: page.toString(),
    limit: "10",
    q: q ?? "",
    pf: pf ?? "",
  });

  //
  useEffect(() => {
    setUsers([]);
    setPage(1);
    refetch();
  }, [q, pf, f]);

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (items) {
      setUsers((prev) => [...prev, ...items]);
    }
  }, [data?.metadata]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setUsers([]);
    };
  }, []);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  const loading = isLoading || isFetching;

  return (
    <div className="max-h-[calc(100vh-(150px))] overflow-y-auto">
      {/*  */}
      <div>
        {users.map((item) => (
          <UserToFollowItem key={item._id} user={item} />
        ))}
      </div>

      {/*  */}
      {loading
        ? Array.from({ length: 2 }).map((_, i) => (
            <UserToFollowItemSkeleton key={`more-${i}`} />
          ))
        : !!users.length && (
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
      {!users.length && !loading && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-500 text-lg">
            Không có người dùng nào phù hợp với <strong>"{q}"</strong>
          </p>
        </div>
      )}
    </div>
  );
}
