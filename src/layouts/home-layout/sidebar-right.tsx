import { useLocation } from "react-router-dom";
import { OutstandingThisWeekCard } from "~/components/outstanding-this-week/outstanding-this-week-card";
import { RelatedWhoCard } from "~/components/related-who-card/related-who-card";
import { SearchFilterCard } from "~/components/search-advanced/search-filter-card";
import { TodayNewsCard } from "~/components/today-news/today-news-card";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { WhoToFollowCard } from "~/components/who-to-follow/who-to-follow-card";

export function SidebarRight() {
  const { pathname } = useLocation();
  const isOpenFilter = pathname === "/search";

  return (
    <div className="pl-4">
      <div className="space-y-4 max-h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide">
        <div className="mb-4 mt-2">
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
        <RelatedWhoCard />
        <TodayNewsCard />
        <OutstandingThisWeekCard />
        <WhoToFollowCard />
      </div>
    </div>
  );
}
