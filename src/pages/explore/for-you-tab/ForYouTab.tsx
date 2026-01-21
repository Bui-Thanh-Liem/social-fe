import { TabsContent } from "~/components/ui/tabs";
import { OutstandingThisWeek } from "./OutstandingThisWeek";
import { TodayNews } from "./TodayNews";
import { WhoToFollows } from "./WhoToFollows";

export function ForYouTab() {
  return (
    <TabsContent
      value="for-you"
      className="px-4 pb-4 overflow-y-auto h-[calc(100vh-140px)]"
    >
      <TodayNews />
      <OutstandingThisWeek />
      <WhoToFollows />
    </TabsContent>
  );
}
