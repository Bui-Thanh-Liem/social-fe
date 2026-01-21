import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "~/components/icons/close";
import { AvatarMain } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/wrapIcon";
import {
  useDeleteNotification,
  useGetMultiByType,
  useReadNotification,
} from "~/apis/useFetchNotifications";
import { cn } from "~/lib/utils";
import { ENotificationType, ETweetType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { formatTimeAgo } from "~/utils/date-time";
import { handleResponse } from "~/utils/toast";

//
type Props = {
  noti: INotification;
  onClick?: (noti: INotification) => void;
  onDelete?: (noti: INotification) => void;
};

// --- Skeleton ---
function SkeletonNotiItem() {
  return (
    <div className="w-full flex items-start gap-3 p-3 rounded-lg animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="h-3 rounded bg-slate-200 w-1/3" />
            <div className="mt-2 h-2 rounded bg-slate-200 w-1/4" />
          </div>
          <div className="h-2 w-8 rounded bg-slate-200" />
        </div>
        <div className="mt-3 h-3 rounded bg-slate-200 w-3/4" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-5 w-16 rounded bg-slate-200" />
          <div className="h-5 w-24 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

//
function NotiItem({ noti, onClick, onDelete }: Props) {
  const navigate = useNavigate();
  const [read, setRead] = useState(noti?.isRead);
  const sender =
    typeof noti.sender === "object" ? (noti.sender as IUser) : undefined;

  //
  function handlerClick() {
    if (onClick) onClick(noti);
    setRead(true);

    if (!noti?.ref_id) return;

    //
    if (noti.type === ENotificationType.Mention_like) {
      const _tweet = noti.tweet_ref as ITweet; // Mentions thì ref là tweet

      // Được nhắc đến trong comment
      if (_tweet.type === ETweetType.Comment) {
        console.log("Được nhắc đến trong comment::");
        navigate(`/tweet/${_tweet.parent_id}`);
        return;
      }

      // Được nhắc đến trong bài viết
      console.log("nhắc đến trong bài viết::");
      navigate(`/tweet/${_tweet._id}`);
      return;
    }

    //
    if (noti.type === ENotificationType.Follow) {
      const _user = noti.user_ref as IUser; // Follow thì ref là user
      navigate(`/${_user.username}`);
      return;
    }

    //
    if (noti.type === ENotificationType.Community) {
      const _community = noti.community_ref as ICommunity;
      navigate(`/communities/${_community?.slug}`);
      return;
    }
  }

  //
  return (
    <button
      onClick={handlerClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 relative cursor-pointer group ${
        read ? "bg-slate-50 hover:bg-slate-100" : "bg-sky-50"
      }`}
    >
      {/*  */}
      {!read && (
        <div className="w-2 h-2 rounded-full bg-sky-400 absolute top-1.5 left-1.5 z-10" />
      )}

      {/* Avatar */}
      <div className="flex-shrink-0">
        <AvatarMain src={sender?.avatar?.url} alt={sender?.name || "avatar"} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-medium truncate">
              {sender?.name || "Someone"}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {sender?.username}
            </div>
            <p className="text-xs text-gray-400">
              {formatTimeAgo(noti.created_at as unknown as string)}
            </p>
          </div>
        </div>

        <div className="mt-1 text-sm text-slate-700 truncate">
          {noti.content}
        </div>

        {/* Extra row: type / ref */}
        {/* <div className="mt-2 flex items-center gap-2">
          {noti.ref_id && (
            <span className="text-xs text-slate-400 truncate">
              Ref: {String(noti.ref_id)}
            </span>
          )}
        </div> */}
      </div>

      <WrapIcon
        className="p-[3px] absolute top-1.5 right-1.5 bg-transparent hidden group-hover:inline-block"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (onDelete) onDelete(noti);
        }}
      >
        <CloseIcon size={16} color="#e2877d" />
      </WrapIcon>
    </button>
  );
}

export function TabContent({
  type,
  emptyText,
}: {
  type: ENotificationType;
  emptyText: string;
}) {
  //
  const [notis, setNotis] = useState<INotification[]>([]);
  const [page, setPage] = useState(1);

  //
  const total_page_ref = useRef(0);
  const { data, isLoading, refetch } = useGetMultiByType({
    queries: { page: page.toString(), limit: "20" },
    type,
  });

  const apiDeleteNoti = useDeleteNotification();
  const apiReadNoti = useReadNotification();

  // Socket
  useNotificationSocket(
    (newNoti) => {
      if (newNoti && newNoti.type === type) {
        setNotis((prev) => [newNoti, ...prev]);
      }
    },
    () => {},
    () => {},
  );

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page ?? 1;
    total_page_ref.current = total_page;
    if (items.length) {
      if (page === 1) {
        setNotis(items);
      } else {
        setNotis((prev) => [...prev, ...items]);
      }
    }
  }, [data, page, type]);

  //
  useEffect(() => {
    setPage(1);
    // setNotis([]);
    refetch();
  }, [refetch, type]);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  async function handlerReadNoti(noti: INotification) {
    if (!noti.isRead) {
      await apiReadNoti.mutateAsync(noti._id);
      refetch();
    }
  }

  //
  async function onDel(noti: INotification) {
    const resDeleted = await apiDeleteNoti.mutateAsync(noti._id);
    if (resDeleted.statusCode !== 200) handleResponse(resDeleted);
    setNotis((prev) => prev.filter((n) => n._id !== noti._id));
  }

  useEffect(() => {
    console.log("isLoading:::", isLoading);
  }, [isLoading]);
  console.log("isLoading:::", isLoading);

  //
  return (
    <div className="space-y-3">
      {isLoading &&
        page === 1 &&
        Array.from({ length: 2 }).map((_, i) => (
          <SkeletonNotiItem key={`more-${i}`} />
        ))}

      {/*  */}
      {notis.map((item) => (
        <NotiItem
          noti={item}
          key={item._id}
          onDelete={onDel}
          onClick={handlerReadNoti}
        />
      ))}

      {/*  */}
      {isLoading &&
        Array.from({ length: 2 }).map((_, i) => (
          <SkeletonNotiItem key={`more-${i}`} />
        ))}

      {/*  */}
      {!notis.length && !isLoading && (
        <div className="flex justify-center flex-col items-center">
          <p className="text-xl mb-1">Chưa có gì ở đây</p>
          <p className="text-gray-400 w-80 lg:w-96 text-justify">{emptyText}</p>
        </div>
      )}

      {/*  */}
      {!!notis.length && (
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
    </div>
  );
}
