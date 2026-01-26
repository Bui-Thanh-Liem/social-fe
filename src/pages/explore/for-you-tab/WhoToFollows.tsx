import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/WhoToFollowItem";
import { useGetTopFollowedUsers } from "~/apis/useFetchUser";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function WhoToFollows() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const total_page_ref = useRef(0);
  const { data, isLoading } = useGetTopFollowedUsers({
    page: page.toString(),
    limit: "10",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;
    if (items) {
      setUsers((prev) => [...prev, ...items]);
    }
  }, [data]);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  // Scroll to top khi có hash #who-to-follow
  useEffect(() => {
    if (window.location.hash === "#who-to-follow") {
      const el = document.getElementById("who-to-follow");

      if (el) {
        setTimeout(() => {
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
      setUsers([]);
    };
  }, []);

  //
  return (
    <>
      <a
        id="who-to-follow"
        className="block"
        style={{
          scrollMarginTop: "80px",
        }}
      ></a>
      <p className="text-xl font-bold mt-3 py-2 sticky top-0 z-40 bg-gray-50">
        Ai để theo dõi
      </p>

      {/*  */}
      <div>
        {users.map((item) => (
          <UserToFollowItem key={item._id} user={item} />
        ))}
      </div>

      {/*  */}
      {isLoading
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
      {!users.length && !isLoading && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-400">Chưa có người dùng nổi bật</p>
        </div>
      )}
    </>
  );
}
