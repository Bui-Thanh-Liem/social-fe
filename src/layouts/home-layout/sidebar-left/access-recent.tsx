import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteAccessRecent,
  useDeleteAllAccessRecent,
  useGetMultiAccessRecent,
} from "~/apis/access-recent.api";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn.util";
import type { IAccessRecent } from "~/shared/interfaces/schemas/access-recent.interface";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useTriggerAccessRecentStore } from "~/storage/use-trigger-access-recent.storage";
import { useUserStore } from "~/storage/use-user.storage";
import { handleResponse } from "~/utils/toast.util";

export function AccessRecent() {
  //
  const [accessRecent, setAccessRecent] = useState<IAccessRecent[]>([]);
  const [page, setPage] = useState(1);
  const total_page_ref = useRef(0);

  //
  const { user } = useUserStore();
  const { state } = useTriggerAccessRecentStore();

  //
  const apiDeleteAccessRecent = useDeleteAccessRecent();
  const apiDeleteAllAccessRecent = useDeleteAllAccessRecent();
  const { data, refetch } = useGetMultiAccessRecent({
    page: page.toString(),
    limit: "4",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page ?? 1;
    total_page_ref.current = total_page;
    if (items.length) {
      if (page === 1) {
        setAccessRecent(items);
      } else {
        setAccessRecent((prev) => [...prev, ...items]);
      }
    }
  }, [data, page]);

  //
  useEffect(() => {
    refetch();
  }, [state]);

  //
  async function onDeleteRecent(id: string) {
    const res = await apiDeleteAccessRecent.mutateAsync({ _id: id });
    handleResponse(res, () => {
      setAccessRecent((prev) => prev.filter((x) => x._id !== id));
    });
  }

  async function onDeleteAllRecent() {
    const res = await apiDeleteAllAccessRecent.mutateAsync();
    handleResponse(res, () => {
      setAccessRecent([]);
    });
  }

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  if (accessRecent.length === 0 || !user?._id) return null;

  const cla = "flex gap-x-3 p-2 rounded-full hover:bg-gray-100 cursor-pointer";
  return (
    <AccordionItem value="recent">
      <AccordionTrigger className="cursor-pointer">
        Xem gần đây
      </AccordionTrigger>
      <AccordionContent className="pl-2 max-h-60 overflow-y-auto">
        {accessRecent.map((x) => {
          const ref = x.detail;

          if (x.type === "user") {
            return (
              <Link
                key={x._id}
                to={`/${(ref as IUser).username || ""}`}
                className={cn(cla, "relative group")}
              >
                <img
                  src={(ref as IUser).avatar?.url}
                  alt={(ref as IUser).username}
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-[16px] line-clamp-1 max-w-24">
                  {(ref as IUser).name}
                </p>
                <X
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDeleteRecent(x._id);
                  }}
                  className="absolute text-red-400 top-1/2 right-3 -translate-y-1/2 hidden group-hover:block"
                />
              </Link>
            );
          }

          if (x.type === "community") {
            return (
              <Link
                to={`/communities/${(ref as ICommunity).slug}`}
                className={cn(cla, "relative group")}
              >
                <img
                  src={(ref as ICommunity).cover?.url}
                  alt={(ref as ICommunity).name}
                  className="w-7 h-7 rounded-full object-contain"
                />
                <p className="text-[16px] line-clamp-1 max-w-24">
                  {(ref as ICommunity).name}
                </p>
                <X
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDeleteRecent(x._id);
                  }}
                  className="absolute text-red-400 top-1/2 right-3 -translate-y-1/2 hidden group-hover:block"
                />
              </Link>
            );
          }
        })}
        <div className="flex items-center gap-x-4 mt-2">
          <Button
            variant="ghost"
            className={cn(
              "text-gray-400",
              total_page_ref.current <= page
                ? "text-gray-300 pointer-events-none"
                : "",
            )}
            onClick={onSeeMore}
          >
            Xem thêm
          </Button>
          <Button
            variant="ghost"
            className="text-red-400"
            onClick={onDeleteAllRecent}
          >
            Xoá tất cả
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
