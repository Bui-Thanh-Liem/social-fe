import { useLocation } from "react-router-dom";
import { OutstandingThisWeekCard } from "~/components/outstanding-this-week/OutstandingThisWeekCard";
import { RelatedWhoCard } from "~/components/related-who-card/RelatedWhoCard";
import { SearchAdvanced } from "~/components/search-advanced/SearchAdvanced";
import { SearchFilterCard } from "~/components/search-advanced/SearchFilterCard";
import { TodayNewsCard } from "~/components/today-news/TodayNewsCard";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { WhoToFollowCard } from "~/components/who-to-follow/WhoToFollowCard";

export function SidebarRight() {
  const { pathname } = useLocation();

  const isHiddenSearch =
    pathname === "/explore" ||
    pathname === "/search" ||
    pathname === "/communities/t/explore";
  const isOpenFilter = pathname === "/search";

  return (
    <div className="px-4">
      <div className="mb-4 mt-2">
        {!isHiddenSearch && (
          <SearchAdvanced
            size="lg"
            className="w-[300px]"
            placeholder="liemdev, #developer"
          />
        )}

        {isOpenFilter && (
          <>
            <Card className="py-2 mb-4">
              <CardHeader className="px-4">
                <CardTitle className="text-xl">Bộ lọc tìm kiếm</CardTitle>
              </CardHeader>
            </Card>
            <SearchFilterCard />
          </>
        )}
      </div>

      <div className="space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
        <RelatedWhoCard />
        <TodayNewsCard />
        <OutstandingThisWeekCard />
        <WhoToFollowCard />
      </div>
    </div>
  );
}
