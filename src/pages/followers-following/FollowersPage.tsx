import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/who-to-follow-item";
import { useGetFollowedById, useGetOneByUsername } from "~/apis/useFetchUser";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function FollowersPage() {
  const { username } = useParams();

  const { data } = useGetOneByUsername(username!);
  const profile = data?.metadata;

  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const total_page_ref = useRef(0);
  const {
    data: fd,
    isLoading,
    isFetching,
  } = useGetFollowedById(profile?._id || "", {
    page: page.toString(),
    limit: "20",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = fd?.metadata?.items || [];
    const total_page = fd?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (items) {
      setUsers((prev) => [...prev, ...items]);
    }
  }, [fd?.metadata]);

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
    <div className="max-h-[calc(100vh-120px)] overflow-y-auto px-4">
      <div>
        {users.map((u) => (
          <UserToFollowItem key={u?._id} user={u} />
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
          <p className="text-gray-500 text-lg">Không có người dùng</p>
        </div>
      )}
    </div>
  );
}
