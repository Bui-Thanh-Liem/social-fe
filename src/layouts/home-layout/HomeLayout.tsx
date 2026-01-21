import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TweetDetailDrawer } from "~/components/list-tweets/tweet-detail-drawer";
import { cn } from "~/lib/utils";
import ChatBox from "~/pages/messages/ChatBox";
import { DetailAttachmentDrawer } from "~/pages/messages/detail-all-attachments";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { socket } from "~/socket/socket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";
import { NavForMobile } from "~/layouts/home-layout/NavForMobile";

export function HomeLayout() {
  const { isOpen } = useChatBoxStore();
  const { user } = useUserStore();
  const { setUnread, setUnreadByType } = useUnreadNotiStore();
  const { pathname } = useLocation();
  const isMessage = pathname === "/messages";

  // Một kết nối socket duy nhất cho toàn ứng dụng
  useEffect(() => {
    socket.connect();
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, user?._id);

    return () => {
      socket.disconnect();
    };
  }, []);

  //
  useNotificationSocket(() => {}, setUnread, setUnreadByType);

  //
  return (
    <div className="w-full">
      <div className="mx-auto flex h-screen overflow-hidden">
        <aside className="hidden lg:block w-0 lg:w-[22%] lg:pr-4 h-screen">
          <SidebarLeft />
        </aside>

        <main
          className={cn(
            "w-[100%] lg:w-[50%] col-span-6 border-r border-l border-gray-200",
            isMessage && "w-full lg:w-[90%]",
          )}
        >
          <Outlet />
        </main>

        {/* Trường hơp đặt biệt trang message */}
        {!isMessage ? (
          <aside className="h-screen w-0 md:flex-1">
            <SidebarRight />
          </aside>
        ) : null}
      </div>
      <NavForMobile />
      {isOpen && <ChatBox />}
      <TweetDetailDrawer />
      <DetailAttachmentDrawer />
    </div>
  );
}
