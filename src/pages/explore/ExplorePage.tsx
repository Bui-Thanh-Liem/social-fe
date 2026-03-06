import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ForYouTab } from "./for-you-tab/ForYouTab";
import { TrendingTab } from "./trending-tab/TrendingTab";

export function ExplorePage() {
  return (
    <Tabs defaultValue="for-you" className="grid grid-cols-12">
      <div className="col-span-3"></div>
      <div className="col-span-9">
        <div className="mb-2 sticky top-0 z-50">
          <TabsList className="w-full">
            <TabsTrigger className="cursor-pointer" value="for-you">
              Dành cho bạn
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="trending">
              Xu hướng
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="pt-0">
          <ForYouTab />
          <TrendingTab />
        </div>
      </div>
    </Tabs>
  );
}
