import { SearchAdvanced } from "~/components/search-advanced/SearchAdvanced";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ForYouTab } from "./for-you-tab/ForYouTab";
import { TrendingTab } from "./trending-tab/TrendingTab";

export function ExplorePage() {
  return (
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        <SearchAdvanced
          size="lg"
          className="md:w-[580px]"
          placeholder="liemdev, #developer"
        />
      </div>

      <div>
        <Tabs defaultValue="for-you" className="mb-12">
          <div className="pt-2 mb-2 sticky top-0 z-50">
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
        </Tabs>
      </div>
    </div>
  );
}
