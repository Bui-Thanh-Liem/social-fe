import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { SearchAdvanced } from "~/components/search-advanced/search-advanced";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { ForYouTab } from "./for-you-tab/ForYouTab";
import { TrendingTab } from "./trending-tab/TrendingTab";
import { useLocation, useNavigate } from "react-router-dom";

export function ExplorePage() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [searchVal, setSearchVal] = useState("");

  // ✅ Khi người dùng đổi tab → điều hướng sang route tương ứng
  const handleTabChange = (value: string) => {
    navigate(`${pathname}${value}`);
  };

  return (
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        {searchVal && (
          <WrapIcon onClick={() => setSearchVal("")}>
            <ArrowLeftIcon />
          </WrapIcon>
        )}
        <SearchAdvanced
          size="lg"
          onChange={setSearchVal}
          className="w-[580px]"
          placeholder="bui_thanh_liem, #developer, devops engineer"
        />
      </div>

      <div>
        <Tabs
          defaultValue=""
          className="mb-12"
          value={hash}
          onValueChange={handleTabChange}
        >
          <div className="pt-2 mb-2 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="">
                Dành cho bạn
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="#trending">
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
