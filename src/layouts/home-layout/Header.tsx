import { BellIcon, MessageCircleMore, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "~/apis/useFetchAuth";
import { Logo } from "~/components/Logo";
import { SearchAdvanced } from "~/components/search-advanced/SearchAdvanced";
import { Tweet } from "~/components/tweet/Tweet";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/WrapIcon";
import { CONSTANT_DEFAULT_TITLE_DOCUMENT } from "~/shared/constants/default-title-document";
import { ENotificationType, ETweetType } from "~/shared/enums/type.enum";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { playNotificationSound } from "~/utils/notificationSound";

export function Header() {
  const { user } = useUserStore();
  const logout = useLogout();
  const navigate = useNavigate();

  //
  const { unread } = useUnreadNotiStore();

  //
  const [unreadCountNoti, setUnreadCountNoti] = useState(0);
  const [unreadCountConversation, setUnreadCountConversation] = useState(0);

  //
  useEffect(() => {
    //
    if (unreadCountNoti < unread) {
      playNotificationSound();
    }

    //
    document.title =
      unread > 0
        ? `(${unread}) thông báo chưa đọc`
        : CONSTANT_DEFAULT_TITLE_DOCUMENT;

    const oldLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"]',
    );

    oldLinks.forEach((link) => link.remove());

    // Tạo favicon mới
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
    document.head.appendChild(link);
    setUnreadCountNoti(unread);
  }, [unread]);

  //
  useConversationSocket(
    () => {},
    (_unread) => {
      //
      if (unreadCountConversation < _unread) {
        playNotificationSound();
      }

      //
      document.title =
        _unread > 0
          ? `(${_unread}) tin nhắn chưa đọc`
          : CONSTANT_DEFAULT_TITLE_DOCUMENT;

      const oldLinks = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]',
      );
      oldLinks.forEach((link) => link.remove());

      // Tạo favicon mới
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = _unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
      document.head.appendChild(link);
      setUnreadCountConversation(_unread);
    },
    () => {},
  );

  //
  const [isOpenPost, setIsOpenPost] = useState(false);

  //
  async function onLogout() {
    await logout.mutateAsync();
  }

  //
  function handleOpenPost() {
    setIsOpenPost(true);
  }

  //
  function onSuccessPost() {
    setIsOpenPost(false);
  }

  return (
    <>
      <header className="grid-cols-3 grid items-center px-4">
        <div className="col-span-1">
          <WrapIcon>
            <Logo size={40} />
          </WrapIcon>
        </div>

        <div className="col-span-1">
          <div className="w-[560px] rounded-full outline-2 outline-sky-300">
            <SearchAdvanced
              className="w-[580px]"
              placeholder="liemdev, #developer"
            />
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <div className="flex gap-x-8 items-center">
            <ButtonMain size="sm" onClick={handleOpenPost} variant={"outline"}>
              <Plus /> Đăng Bài
            </ButtonMain>

            <Link
              to={`/notifications#${ENotificationType.Community}`}
              className="p-1 relative cursor-pointer"
            >
              {unreadCountNoti > 0 && (
                <span className="absolute top-0 left-4 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
                  {unreadCountNoti > 9 ? "9+" : unreadCountNoti}
                </span>
              )}
              <BellIcon />
            </Link>

            <Link to="/messages" className="p-1 relative cursor-pointer">
              {unreadCountConversation > 0 && (
                <span className="absolute top-0 left-4 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
                  {unreadCountConversation > 9 ? "9+" : unreadCountConversation}
                </span>
              )}
              <MessageCircleMore />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:outline-2 hover:cursor-pointer rounded-full">
                  <AvatarMain
                    alt={user?.name}
                    src={user?.avatar?.url}
                    className="w-10 h-10"
                  />
                </button>
              </DropdownMenuTrigger>

              {/*  */}
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate({
                        pathname: user?.username
                          ? `/${user.username}`
                          : "/profile",
                      });
                    }}
                  >
                    Hồ sơ
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} variant="destructive">
                    Đăng xuất
                    <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/*  */}
      <DialogMain
        width="2xl"
        isLogo={false}
        open={isOpenPost}
        onOpenChange={setIsOpenPost}
      >
        <Tweet
          contentBtn="Đăng bài"
          onSuccess={onSuccessPost}
          tweetType={ETweetType.Tweet}
          placeholder="Có chuyện gì thế ? @liemdev, #developer"
        />
      </DialogMain>
    </>
  );
}
