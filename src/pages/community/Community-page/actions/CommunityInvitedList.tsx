import { ScrollText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VerifyIcon } from "~/components/icons/verify";
import { AvatarMain } from "~/components/ui/avatar";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import {
  useDeleteInvitation,
  useGetMultiInvitations,
} from "~/apis/useFetchCommunity";
import { cn } from "~/lib/utils";
import type {
  ICommunity,
  ICommunityInvitation,
} from "~/shared/interfaces/schemas/community.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/toast";
import { formatTimeUntil } from "~/utils/date-time";

export function CommunityInvitedList({ community }: { community: ICommunity }) {
  //
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [invited, setInvited] = useState<ICommunityInvitation[]>([]);

  //
  const total_page_ref = useRef(0);

  const apiDelete = useDeleteInvitation();
  const { data, isLoading } = useGetMultiInvitations(
    community._id,
    {
      page: page.toString(),
      limit: "10",
    },
    isOpen
  );

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1) {
      setInvited(items);
    } else {
      setInvited((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString())
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setInvited([]);
    };
  }, []);

  //
  if (!community.is_joined) return null;
  if (!community.is_admin) {
    if (
      (community.is_mentor && !community.show_invite_list_for_mentor) ||
      (community.is_member && !community.show_invite_list_for_member)
    ) {
      return null;
    }
  }

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  async function onDelete(id: string) {
    const res = await apiDelete.mutateAsync({
      invitation_id: id,
      community_id: community._id,
    });

    if (![200, 201].includes(res.statusCode)) {
      handleResponse(res);
    }
  }

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <ScrollText size={18} />
      </WrapIcon>

      <DialogMain
        textHeader="Danh sách đã mời"
        textDesc="Những lời mời sẽ tự động xoá khi hết hiệu lực."
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="space-y-2">
          {invited.map((invite) => (
            <InvitedItem
              key={invite._id}
              invited={invite}
              onDelete={onDelete}
            />
          ))}

          {/*  */}
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <InvitedItemSkeleton key={`more-${i}`} />
              ))
            : !!invited.length && (
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

          {/*  */}
          {!isLoading && invited.length === 0 && page === 1 && (
            <p className="p-4 text-center text-gray-400">
              Cộng đồng của bạn chưa mời ai
            </p>
          )}
        </div>
      </DialogMain>
    </>
  );
}

export function InvitedItem({
  invited,
  onDelete,
}: {
  invited: ICommunityInvitation;
  onDelete: (id: string) => void;
}) {
  const { user_id } = invited;
  const user = user_id as unknown as IUser;

  return (
    <div className="group flex items-center justify-between hover:bg-gray-100 p-2 rounded-sm cursor-pointer">
      <div className="flex gap-2">
        <AvatarMain src={user?.avatar?.url} alt={user?.name} />
        <div>
          <Link to={`/${user?.username}`} className="flex items-center gap-2">
            <p className="text-sm leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
              {user.name}
              <VerifyIcon active={!!user.verify} size={20} />
            </p>
          </Link>
          <p className="text-xs text-muted-foreground">{user.username}</p>
          {user.bio && <p className="line-clamp-3 max-w-[95%]">{user.bio}</p>}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400 group-hover:hidden">
          {invited.inviter &&
            `${(invited.inviter as unknown as IUser)?.name} đã mời ,`}
          {formatTimeUntil(invited.exp as unknown as string)}
        </p>
        <WrapIcon
          className="hidden group-hover:block"
          onClick={() => onDelete(invited._id)}
        >
          <X size={18} color="red" />
        </WrapIcon>
      </div>
    </div>
  );
}

export function InvitedItemSkeleton() {
  return (
    <div className="group flex items-center justify-between hover:bg-gray-100 p-2 rounded-sm cursor-pointer">
      <div className="flex gap-2">
        {/* Avatar Skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

        <div className="flex flex-col gap-1">
          {/* Name */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          {/* Username */}
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          {/* Bio (3 dòng giả) */}
          <div className="h-3 w-[95%] bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-[85%] bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-[70%] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-center">
        {/* Thời gian hoặc nút X */}
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
