import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./components/sidebar-mobile/sidebar";
import { HomeLayout } from "./layouts/home-layout/home-layout";

// Router config
const router = createBrowserRouter([
  {
    path: "/*",
    element: <HomeLayout />,
    children: [
      {
        path: "*", // Để ModalSwitch tự xử lý tất cả các path con
        element: null,
      },
    ],
  },
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
