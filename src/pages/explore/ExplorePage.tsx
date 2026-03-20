import { Tabs } from "~/components/ui/tabs";
import { OutstandingThisWeek } from "./OutstandingThisWeek";
import { TodayNews } from "./TodayNews";
import { Trending } from "./Trending";
import { WhoToFollows } from "./WhoToFollows";

export function ExplorePage() {
  return (
    <Tabs
      defaultValue="for-you"
      className="grid grid-cols-8 overflow-y-auto h-[calc(100vh-60px)] scrollbar-hide"
    >
      <div className="col-span-0 xl:col-span-1"></div>
      <div className="col-span-8 xl:col-span-7">
        <div className="">
          <TodayNews />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-8">
              <OutstandingThisWeek />
              <WhoToFollows />
            </div>
            <div className="col-span-12 xl:col-span-4 mb-4">
              <Trending />
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
