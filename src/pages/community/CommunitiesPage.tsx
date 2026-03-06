import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ExploreTab } from "./explore-tab/ExploreTab";
import { JoinedTab } from "./joined-tab/JoinedTab";
import { OwnerTab } from "./owner-tab/OwnerTab";

export const joined_tab = "joined";
export const explore_tab = "explore";

export function CommunitiesPage() {
  const navigate = useNavigate();

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

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3"></div>
      <div className="col-span-9">
        <Tabs defaultValue="/" value={type} onValueChange={handleTabChange}>
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
            <TabsContent value="/" className="pt-2">
              <OwnerTab />
            </TabsContent>
            <TabsContent value={joined_tab} className="pt-2">
              <JoinedTab />
            </TabsContent>
            <TabsContent value={explore_tab} className="pt-2">
              <ExploreTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
