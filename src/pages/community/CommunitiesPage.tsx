import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchMain } from "~/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CreateCommunity } from "./CreateCommunity";
import { ExploreTab } from "./explore-tab/ExploreTab";
import { JoinedTab } from "./joined-tab/JoinedTab";
import { OwnerTab } from "./owner-tab/OwnerTab";
import { cn } from "~/lib/utils";

export const joined_tab = "joined";
export const explore_tab = "explore";

export function CommunitiesPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const [searchVal, setSearchVal] = useState("");

  //
  const isOpenSearch = pathname === "/communities/t/explore";

  // ✅ Xác định type theo pathname hiện tại
  const type = location.pathname.endsWith(joined_tab)
    ? joined_tab
    : location.pathname.endsWith(explore_tab)
      ? explore_tab
      : "/";

  // ✅ Khi người dùng đổi tab → điều hướng sang route tương ứng
  const handleTabChange = (value: string) => {
    navigate(`/communities${value !== "/" ? `/t/${value}` : ""}`);
  };

  //
  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigate(`${pathname}${searchVal ? `?search=${searchVal}` : ""}`);
    }
  }

  return (
    <div>
      {/* Header */}
      {/* <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-x-3">
          <span className={cn("hidden", isOpenSearch ? "block w-96" : "")}>
            <SearchMain
              size="sm"
              value={searchVal}
              onChange={setSearchVal}
              onKeyDown={handleSearch}
              onClear={() => setSearchVal("")}
            />
          </span>
          <CreateCommunity />
        </div>
      </div> */}

      {/*  */}
      <div>
        <Tabs
          defaultValue="/"
          className="mb-12"
          value={type}
          onValueChange={handleTabChange}
        >
          <div className="sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value="/"
              >
                <span>Của bạn</span>
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={joined_tab}
              >
                <span>Đã tham gia</span>
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={explore_tab}
              >
                <span>Khám phá</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div>
            <TabsContent value="/" className="py-2">
              <OwnerTab />
            </TabsContent>
            <TabsContent value={joined_tab} className="py-2">
              <JoinedTab />
            </TabsContent>
            <TabsContent value={explore_tab} className="py-2">
              <ExploreTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
