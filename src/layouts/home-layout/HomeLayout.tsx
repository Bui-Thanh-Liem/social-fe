import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TweetDetailDrawer } from "~/components/list-tweets/TweetDetailDrawer";
import { cn } from "~/lib/utils";
import ChatBox from "~/pages/messages/ChatBox";
import { DetailAttachmentDrawer } from "~/pages/messages/DetailAllAttachments";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { socket } from "~/socket/socket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";
import { Header } from "./Header";

export function HomeLayout() {
  const { isOpen } = useChatBoxStore();
  const { user } = useUserStore();
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

  //
  return (
    <div>
      {/*  */}
      <Header />

      {/*  */}
      <div className="mx-auto flex border-t overflow-hidden">
        <aside className="block w-[22%] pr-4 pl-4">
          <SidebarLeft />
        </aside>

        <main className={cn("lg:w-[50%] col-span-6 border-gray-200")}>
          <Outlet />
        </main>

        <aside className="flex-1 pr-4">
          <SidebarRight />
        </aside>
      </div>

      {/*  */}
      {isOpen && <ChatBox />}

      {/*  */}
      <TweetDetailDrawer />

      {/*  */}
      <DetailAttachmentDrawer />
    </div>
  );
}
