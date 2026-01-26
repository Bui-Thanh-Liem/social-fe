import { Pin, Trash, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotIcon } from "~/components/icons/dot";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SearchMain } from "~/components/ui/search";
import { WrapIcon } from "~/components/WrapIcon";
import {
  useDeleteConversation,
  useGetMultiConversations,
  useReadConversation,
  useTogglePinConversation,
} from "~/apis/useFetchConversations";
import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/lib/utils";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useStatusSocket } from "~/socket/hooks/useStatusSocket";
import { useConversationActiveStore } from "~/store/useConversationActiveStore";
import { useUserStore } from "~/store/useUserStore";
import { formatTimeAgo } from "~/utils/date-time";
import { ErrorResponse } from "~/components/Error";
import { useOnlStore } from "~/store/useOnlStore";
import { checkOnl } from "~/utils/checkOnl.util";

//
function ConversationItemSkeleton() {
  return (
    <div className="p-3 flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

//
function ConversationItem({
  onclick,
  isActive,
  onDeleted,
  currentUser,
  conversation,
  onTogglePinned,
}: {
  isActive: boolean;
  onclick: () => void;
  currentUser: IUser | null;
  conversation: IConversation;
  onDeleted?: (id: string) => void;
  onTogglePinned?: (id: string) => void;
}) {
  //
  const navigate = useNavigate();
  const { onlUserIds, setOnlUserIds } = useOnlStore();
  const [isOnl, setOnl] = useState(false);
  const apiDelConversation = useDeleteConversation();
  const apiTogglePinConversation = useTogglePinConversation();

  // Destructuring conversation
  const { avatar, lastMessage, name, _id, type, participants } = conversation;
  const participantIds = (participants as unknown as IUser[])?.map(
    (u) => u._id,
  );

  // Online status socket
  useStatusSocket((val) => {
    if (val.hasOnline === false) {
      setOnlUserIds(onlUserIds.filter((id) => id !== val._id));
    } else {
      setOnlUserIds([...onlUserIds, val._id]);
    }
    setOnl(val.hasOnline);
  });

  //
  let messageLastContent = "Chưa có tin nhắn";
  if (lastMessage) {
    const _lastMessage = lastMessage as unknown as IMessage;
    const isOwner = currentUser?._id === _lastMessage.sender;
    messageLastContent = `${isOwner ? "Bạn: " : ""}${
      _lastMessage.content || "đã gửi hình ảnh hoặc video"
    }`;
  }

  const isUnread = conversation.readStatus?.includes(currentUser?._id || "");
  const pinned = conversation.pinned.find(
    (i) => i.user_id === currentUser?._id,
  );

  //
  async function onTogglePin(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const res = await apiTogglePinConversation.mutateAsync({
      conversation_id: _id,
    });
    if (onTogglePinned && res.statusCode === 200) onTogglePinned(_id);
  }

  //
  async function onDelete(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const res = await apiDelConversation.mutateAsync({ conversation_id: _id });
    if (onDeleted && res.statusCode == 200) onDeleted(_id);
  }

  //
  function onPreviewProfile() {
    navigate(`/${conversation.username}`);
  }

  //
  return (
    <div
      className={cn(
        "relative p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer group",
        isActive && "bg-blue-50",
      )}
      onClick={onclick}
    >
      <div className="relative flex items-center gap-3">
        {(isOnl || checkOnl(onlUserIds, participantIds)) && (
          <span className="absolute bottom-0 left-8 z-10 w-3 h-3 bg-green-400 rounded-full border border-white" />
        )}
        {!Array.isArray(avatar) ? (
          <AvatarMain
            src={avatar?.url}
            alt={name || ""}
            className="w-12 h-12"
          />
        ) : (
          <GroupAvatarMain srcs={avatar.map((a) => a?.url) as string[]} />
        )}
        <div>
          <p className="font-medium">
            {name}{" "}
            {type === EConversationType.Group && (
              <span className="inline-block text-[10px] text-gray-400 p-0.5 px-1 border rounded-full">
                nhóm
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 truncate max-w-[160px]">
            {messageLastContent}
          </p>
        </div>
      </div>

      {/* Right side: time + dropdown trigger (keeps trigger in DOM so Radix can measure) */}
      <div className="relative">
        <div className="relative w-16 h-6 flex items-center justify-end">
          {/* time: fade out on hover */}
          <span className="text-gray-400 text-sm transition-opacity duration-150 opacity-100 group-hover:opacity-0">
            {(lastMessage as any)?.created_at &&
              formatTimeAgo((lastMessage as any).created_at)}
          </span>

          {/* dropdown trigger: keep in DOM, hide visually until hover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 flex items-center justify-end rounded-full outline-0
                     opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                     transition-opacity duration-150"
              >
                <WrapIcon>
                  <DotIcon size={16} />
                </WrapIcon>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={6}
              className="rounded-2xl px-0"
            >
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onTogglePin}
              >
                <Pin strokeWidth={2} className="w-3 h-3" color="#000" />
                <p className="text-sm">{!pinned ? "Ghim" : "Gỡ ghim"}</p>
              </DropdownMenuItem>

              {/*  */}
              {type == EConversationType.Private && (
                <DropdownMenuItem
                  className="cursor-pointer px-3 font-semibold space-x-1"
                  onClick={onPreviewProfile}
                >
                  <User strokeWidth={2} className="w-3 h-3" color="#000" />
                  <p className="text-sm">Xem trang cá nhân</p>
                </DropdownMenuItem>
              )}

              {/*  */}
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onDelete}
              >
                <Trash className="w-3 h-3" color="var(--color-red-400)" />
                <p className="text-red-400 text-sm">Xoá cuộc trò chuyện</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isUnread && (
        <span className="absolute top-2 left-2 w-2 h-2 bg-sky-400 rounded-full" />
      )}
      {pinned && (
        <Pin
          strokeWidth={2}
          className="absolute top-1 right-1 w-3 h-3 rotate-45"
          color="#333"
        />
      )}
    </div>
  );
}

//
export function ConversationList({
  onclick,
}: {
  onclick: (conversation: IConversation | null) => void;
}) {
  const { user } = useUserStore();

  const [page, setPage] = useState(1);
  const { activeId, setActiveId } = useConversationActiveStore();
  const [allConversations, setAllConversations] = useState<IConversation[]>([]);
  const total_page_ref = useRef(0);

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  const { data, isLoading, error } = useGetMultiConversations({
    page: page.toString(),
    limit: "10",
    q: debouncedSearchVal,
  });

  // apis
  const apiReadConversation = useReadConversation();

  //
  const { joinConversation, leaveConversation } = useConversationSocket(
    (_new) => {
      // cập nhật khi có new conversation
      console.log("_new:::", _new);
      setAllConversations((prev) =>
        prev.map((c) =>
          c._id.toString() === _new._id.toString() ? { ...c, ..._new } : c,
        ),
      );
    },
    () => {},
    (changed) => {
      setAllConversations((prev) => {
        const exists = prev.some(
          (c) => c._id.toString() === changed._id.toString(),
        );

        if (exists) {
          // Cập nhật conversation cũ
          return prev.map((c) =>
            c._id.toString() === changed._id.toString()
              ? { ...c, ...changed }
              : c,
          );
        } else {
          // Thêm mới lên đầu
          return [changed, ...prev];
        }
      });
    },
  );

  // Join/leave socket rooms
  useEffect(() => {
    const conversationIds = allConversations?.map((item) => item._id);
    if (conversationIds.length > 0) {
      joinConversation(conversationIds);
    }
    return () => {
      if (conversationIds.length > 0) {
        leaveConversation(conversationIds);
      }
    };
  }, [allConversations, joinConversation, leaveConversation]);

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    //
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && debouncedSearchVal) {
      setAllConversations(items);
    } else {
      setAllConversations((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString()),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setAllConversations([]);
    };
  }, []);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  async function handleClickConversation(conversation: IConversation) {
    onclick(conversation);
    setActiveId(conversation?._id);

    // không gọi api đọc khi đọc rồi
    const isUnread = conversation.readStatus?.includes(user?._id || "");
    if (isUnread) {
      await apiReadConversation.mutateAsync({
        conversation_id: conversation?._id,
      });
    }
  }

  //
  function onDeletedConv(id: string) {
    setAllConversations((prev) => prev.filter((x) => x._id !== id));
    setActiveId("");
    onclick(null);
  }

  //
  function onPinnedConv(id: string) {
    setAllConversations((prev) =>
      prev.map((item: any) => {
        if (item._id === id) {
          const alreadyPinned = item.pinned?.some(
            (p: { user_id: string | undefined }) => p.user_id === user?._id,
          );

          let newPinned;
          if (alreadyPinned) {
            // unpin
            newPinned = item.pinned.filter(
              (p: { user_id: string | undefined }) => p.user_id !== user?._id,
            );
          } else {
            // pin
            newPinned = [
              ...(item.pinned || []),
              { user_id: user?._id, at: new Date() },
            ];
          }

          return { ...item, pinned: newPinned };
        }
        return item;
      }),
    );
  }

  //
  return (
    <div>
      {/*  */}
      <div className="mx-3 my-4">
        <SearchMain
          size="lg"
          value={searchVal}
          onClear={() => setSearchVal("")}
          onChange={setSearchVal}
        />
      </div>

      {/*  */}
      {!isLoading && allConversations.length === 0 && page === 1 && !error && (
        <p className="p-4 text-center text-gray-500">
          Không có cuộc trò chuyện
        </p>
      )}

      {/* Loading lần đầu */}
      {isLoading && page === 1 && (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </div>
      )}

      <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
        {/* List conversations */}
        {allConversations.length > 0 && (
          <div>
            {sortConversations(allConversations, user?._id || "").map(
              (conversation) => (
                <ConversationItem
                  currentUser={user}
                  onDeleted={onDeletedConv}
                  conversation={conversation}
                  onTogglePinned={onPinnedConv}
                  key={conversation._id.toString()}
                  isActive={activeId === conversation._id}
                  onclick={() => handleClickConversation(conversation)}
                />
              ),
            )}
          </div>
        )}

        {/* Loading khi load thêm */}
        {isLoading ? (
          <div className="p-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <ConversationItemSkeleton key={`more-${i}`} />
            ))}
          </div>
        ) : (
          !!allConversations.length && (
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

      {/* Error state */}
      {error && <ErrorResponse onRetry={() => {}} />}
    </div>
  );
}

function sortConversations(conversations: IConversation[], user_id: string) {
  return conversations.sort((a, b) => {
    const aPinned = a.pinned?.some((p) => p.user_id === user_id) ?? false;
    const bPinned = b.pinned?.some((p) => p.user_id === user_id) ?? false;

    if (aPinned && bPinned) {
      // Both pinned, sort by earliest pin time first
      const aPin = a.pinned?.find((p) => p.user_id === user_id);
      const bPin = b.pinned?.find((p) => p.user_id === user_id);

      // Convert `at` to Date if it exists, otherwise use a default date
      const aTime = aPin?.at ? new Date(aPin.at).getTime() : 0;
      const bTime = bPin?.at ? new Date(bPin.at).getTime() : 0;

      return aTime - bTime; // Earlier pinned first, newer pinned last
    }

    if (aPinned) return -1; // a pinned, b not pinned → a first
    if (bPinned) return 1; // b pinned, a not pinned → b first

    // Neither pinned, sort by updated_at (newest first)
    return (
      new Date(b.updated_at ?? 0).getTime() -
      new Date(a.updated_at ?? 0).getTime()
    );
  });
}
