import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppSidebarMobile } from "~/components/sidebar-mobile/app-sidebar-mobile";
import { cn } from "~/utils/cn.util";
import { DetailAttachmentDrawer } from "~/pages/public/messages/detail-all-attachments";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { socket } from "~/socket/socket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { Header } from "./header";
import { SidebarLeft } from "./sidebar-left/sidebar-left";
import { SidebarRight } from "./sidebar-right";
import { TweetDetailPage } from "~/pages/public/tweet-detail/tweet-detail-page";
import { HomePage } from "~/pages/public/home/home-page";
import { ExplorePage } from "~/pages/public/explore/explore-page";
import {
  CommunitiesPage,
  explore_tab,
  joined_tab,
} from "~/pages/public/community/communities-page";
import { SearchPage } from "~/pages/public/search/search-page";
import { BookmarkPage } from "~/pages/public/bookmark/bookmark-page";
import { NotificationPage } from "~/pages/public/notification/notification-page";
import { MessagePage } from "~/pages/public/messages/message-page";
import { MessageView } from "~/pages/public/messages/message-view";
import { TrendingPage } from "~/pages/public/trending/trending-page";
import { ProfilePage } from "~/pages/public/profile/profile-page";
import { GamePage } from "~/pages/public/game/game-page";
import { AlgorithmSearchPage } from "~/pages/public/algorithm/algorithm-search/algorithm-search-page";
import { AlgorithmWrap } from "~/pages/public/algorithm/algorithm-sort/algorithm-wrap";
import { FollowersFollowing } from "~/pages/public/followers-following/followers-following";
import { AlgorithmSortPage } from "~/pages/public/algorithm/algorithm-sort/algorithm-sort-page";
import { CommunityPage } from "~/pages/public/community/Community-page/community-page";
import { CommunityOwnerPage } from "~/pages/public/community/community-owner-page";
import { CommunityJoinedPage } from "~/pages/public/community/community-joined-page";
import { NotThing } from "~/components/state/not-thing";
import ChatBox from "~/pages/public/messages/chatbox";

export function HomeLayout() {
  const { pathname } = useLocation();
  const location = useLocation();

  // Kiểm tra xem có location cũ được lưu trong state không
  const backgroundLocation = location.state?.backgroundLocation;

  //
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

  //
  return (
    <main className="w-screen flex items-center justify-center">
      <div className="w-full px-4 md:w-5/6 md:px-0">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="mx-auto flex border-t overflow-hidden">
          {/* Sidebar Left */}
          <aside className="pr-4 w-60 hidden md:block">
            <SidebarLeft />
          </aside>

          {/*  */}
          <main className="flex-1">
            {/* TẦNG NỀN: Luôn render trang chính */}
            <Routes location={backgroundLocation || location}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />

              {/*  */}
              <Route path="communities" element={<CommunityOwnerPage />} />
              <Route
                path={`communities/t/${joined_tab}`}
                element={<CommunityJoinedPage />}
              />
              <Route
                path={`communities/t/${explore_tab}`}
                element={<CommunitiesPage />}
              />
              <Route path="communities/:slug" element={<CommunityPage />} />

              <Route path="search" element={<SearchPage />} />
              <Route path="bookmarks" element={<BookmarkPage />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="games" element={<GamePage />} />
              <Route
                path="algorithm/search"
                element={<AlgorithmSearchPage />}
              />
              <Route path="algorithm/sort" element={<AlgorithmSortPage />} />
              <Route path="algorithm/sort/:slug" element={<AlgorithmWrap />} />
              <Route path="messages" element={<MessagePage />} />
              <Route
                path="messages/:conversation_name"
                element={<MessageView />}
              />
              <Route path="trending" element={<TrendingPage />} />

              {/* Route cho Profile và các tab con */}
              <Route path=":username" element={<ProfilePage />} />
              <Route
                path=":username/following"
                element={<FollowersFollowing />}
              />
              <Route
                path=":username/followers"
                element={<FollowersFollowing />}
              />

              <Route path="*" element={<NotThing />} />

              {/* Nếu truy cập trực tiếp link thì render Detail tại đây */}
              {!backgroundLocation && (
                <Route path="tweet/:tweet_id" element={<TweetDetailPage />} />
              )}
            </Routes>
          </main>

          {/* Background Location Routes */}
          {backgroundLocation && (
            <Routes>
              <Route path="/tweet/:tweet_id" element={<TweetDetailPage />} />
            </Routes>
          )}

          {/* Sidebar Right */}
          <aside
            className={cn(
              "hidden xl:w-[26%] ",
              isExplorePage ? "hidden" : "xl:block",
            )}
          >
            <SidebarRight />
          </aside>
        </div>

        {/* Messages */}
        {isOpen && Boolean(user?._id) && <ChatBox />}
        <DetailAttachmentDrawer />

        {/* Mobile Sidebar */}
        <AppSidebarMobile />
      </div>
    </main>
  );
}
