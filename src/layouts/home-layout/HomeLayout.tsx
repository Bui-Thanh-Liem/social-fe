import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import { TweetDetailPage } from "~/pages/tweet-detail/TweetDetailPage";
import { HomePage } from "~/pages/home/HomePage";
import { ExplorePage } from "~/pages/explore/ExplorePage";
import {
  CommunitiesPage,
  explore_tab,
  joined_tab,
} from "~/pages/community/CommunitiesPage";
import { SearchPage } from "~/pages/search/SearchPage";
import { BookmarkPage } from "~/pages/bookmark/BookmarkPage";
import { NotificationPage } from "~/pages/notification/NotificationPage";
import { MessagePage } from "~/pages/messages/MessagePage";
import { MessageView } from "~/pages/messages/MessageView";
import { TrendingPage } from "~/pages/trending/TrendingPage";
import { ProfilePage } from "~/pages/profile/ProfilePage";
import { GamePage } from "~/pages/game/GamePage";
import { AlgorithmSearchPage } from "~/pages/algorithm/algorithm-search/AlgorithmSearchPage";
import { AlgorithmWrap } from "~/pages/algorithm/algorithm-sort/AlgorithmWrap";
import { FollowersFollowing } from "~/pages/followers-following/FollowersFollowing";
import { AlgorithmSortPage } from "~/pages/algorithm/algorithm-sort/AlgorithmSortPage";
import { CommunityPage } from "~/pages/community/Community-page/CommunityPage";
import { CommunityOwnerPage } from "~/pages/community/CommunityOwnerPage";
import { CommunityJoinedPage } from "~/pages/community/CommunityJoinedPage";
import { NotThing } from "~/components/state/NotThing";

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
        {isOpen && <ChatBox />}
        <DetailAttachmentDrawer />

        {/* Mobile Sidebar */}
        <AppSidebarMobile />
      </div>
    </main>
  );
}
