import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";
import { RedirectIfNotAuthenticated } from "./components/RedirectIfNotAuthenticated";
import { HomeLayout } from "./layouts/home-layout/HomeLayout";
import RootLayout from "./layouts/root-layout/RootLayout";
import { AuthPage } from "./pages/auth/AuthPage";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { BookmarkPage } from "./pages/bookmark/BookmarkPage";
import {
  CommunitiesPage,
  explore_tab,
  joined_tab,
} from "./pages/community/CommunitiesPage";
import { CommunityPage } from "./pages/community/Community-page/CommunityPage";
import { ExplorePage } from "./pages/explore/ExplorePage";
import {
  followers_tab,
  FollowersFollowing,
  following_tab,
} from "./pages/followers-following/FollowersFollowing";
import { HomePage } from "./pages/home/HomePage";
import { MessagePage } from "./pages/messages/MessagePage";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SearchPage } from "./pages/search/SearchPage";
import { TrendingPage } from "./pages/trending/TrendingPage";
import { TweetDetailPage } from "./pages/tweet-detail/TweetDetailPage";
import { ProtectTweetDetail } from "./components/ProtectTweetDetail";
import NotFound from "./components/NotFound";
import { SidebarProvider } from "./components/sidebar-mobile/sidebar";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <RedirectIfAuthenticated>
            <AuthPage />
          </RedirectIfAuthenticated>
        ),
      },
      { path: "verify", element: <VerifyEmail /> },
      {
        path: "tweet/:tweet_id",
        element: (
          <ProtectTweetDetail>
            <TweetDetailPage />
          </ProtectTweetDetail>
        ),
      },

      // ✅ Bọc các route cần HomeLayout ở đây
      {
        element: (
          <RedirectIfNotAuthenticated>
            <HomeLayout />
          </RedirectIfNotAuthenticated>
        ),
        children: [
          { path: "home", element: <HomePage /> },
          { path: "bookmarks", element: <BookmarkPage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "notifications", element: <NotificationPage /> },
          { path: "messages", element: <MessagePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "communities", element: <CommunitiesPage /> },
          { path: `communities/t/${joined_tab}`, element: <CommunitiesPage /> },
          {
            path: `communities/t/${explore_tab}`,
            element: <CommunitiesPage />,
          },
          { path: "communities/:slug", element: <CommunityPage /> },
          { path: "trending", element: <TrendingPage /> },
          {
            path: `:username/${following_tab}`,
            element: <FollowersFollowing />,
          },
          {
            path: `:username/${followers_tab}`,
            element: <FollowersFollowing />,
          },
          { path: ":username", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

// Tạo Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry 1 lần nếu fail
      refetchOnWindowFocus: false, // Không refetch khi focus lại window
      staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={false}>
        {/*  */}
        <main>
          {/*  */}
          <RouterProvider router={router} />
        </main>

        {/* Dev tools chỉ hiện trong development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SidebarProvider>
    </QueryClientProvider>
  );
}
