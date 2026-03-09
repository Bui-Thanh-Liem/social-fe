import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUpdateQuery } from "~/hooks/useUpdateQuery";
import { MediaTab } from "./MediaTab";
import { PeopleTab } from "./PeopleTab";
import { TopTab } from "./TopTab";
import { TweetTab } from "./TweetTab";
import { CommunityTab } from "./CommunityTab";

export function SearchPage() {
  const updateQuery = useUpdateQuery();

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-0 xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10">
        <Tabs defaultValue="top">
          <div className="bg-white sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer"
                value="top"
                onClick={() =>
                  updateQuery({ add: { t: "top" }, remove: ["f"] })
                }
              >
                Hàng đầu
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer"
                value="community"
                onClick={() =>
                  updateQuery({ add: { t: "top" }, remove: ["f"] })
                }
              >
                Cộng đồng
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer"
                value="people"
                onClick={() => updateQuery({ remove: ["t", "f"] })}
              >
                Mọi người
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer"
                value="tweet"
                onClick={() => updateQuery({ remove: ["t", "f"] })}
              >
                Bài viết
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer line-clamp-1"
                value="media"
                onClick={() =>
                  updateQuery({ add: { f: "media" }, remove: ["t"] })
                }
              >
                Hình ảnh/video
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="pt-0 overflow-y-auto h-[calc(100vh-120px)]">
            <TabsContent value="top" className="px-0">
              <TopTab />
            </TabsContent>
            <TabsContent value="tweet" className="px-0">
              <TweetTab />
            </TabsContent>
            <TabsContent value="community" className="px-0">
              <CommunityTab />
            </TabsContent>
            <TabsContent value="people" className="px-0">
              <PeopleTab />
            </TabsContent>
            <TabsContent value="media" className="px-0">
              <MediaTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
