import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebarMobile } from "~/components/sidebar-mobile/AppSidebarMobile";
import { cn } from "~/lib/utils";
import ChatBox from "~/pages/messages/ChatBox";
import { DetailAttachmentDrawer } from "~/pages/messages/DetailAllAttachments";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { socket } from "~/socket/socket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { Header } from "./Header";
import { SidebarLeft } from "./sidebar-left/SidebarLeft";
import { SidebarRight } from "./SidebarRight";

export function HomeLayout() {
  const { pathname } = useLocation();
  const isExplorePage = pathname.startsWith("/explore");

  const { user } = useUserStore();
  const { isOpen } = useChatBoxStore();
  const { setUnread, setUnreadByType } = useUnreadNotiStore();

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
  console.log("isExplore:::", isExplorePage);

  //
  return (
    <div className="w-screen flex items-center justify-center">
      <div className="w-full px-4 md:w-5/6 md:px-0">
        {/*  */}
        <Header />

        {/*  */}
        <div className="mx-auto flex border-t overflow-hidden">
          <aside className="pr-4 w-60 hidden md:block">
            <SidebarLeft />
          </aside>

          <main className="flex-1">
            <Outlet />
          </main>

          <aside
            className={cn(
              "hidden xl:w-[26%] ",
              isExplorePage ? "hidden" : "xl:block",
            )}
          >
            <SidebarRight />
          </aside>
        </div>

        {/*  */}
        {isOpen && <ChatBox />}

        {/*  */}
        <DetailAttachmentDrawer />

        {/*  */}
        <AppSidebarMobile />
      </div>
    </div>
  );
}
