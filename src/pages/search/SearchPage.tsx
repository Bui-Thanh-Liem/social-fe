import { SearchAdvanced } from "~/components/search-advanced/SearchAdvanced";
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
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        <SearchAdvanced
          size="lg"
          className="md:w-[580px]"
          placeholder="liemdev, #developer"
        />
      </div>

      <div className="mt-1">
        <Tabs defaultValue="top" className="mb-12">
          <div className="bg-white py-2 pt-5 sticky top-0 z-50">
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
          <div className="pt-0">
            <TabsContent value="top" className="px-0 pb-4">
              <TopTab />
            </TabsContent>
            <TabsContent value="tweet" className="px-0 pb-4">
              <TweetTab />
            </TabsContent>
            <TabsContent value="community" className="px-0 pb-4">
              <CommunityTab />
            </TabsContent>
            <TabsContent value="people" className="px-0 pb-4">
              <PeopleTab />
            </TabsContent>
            <TabsContent value="media" className="px-0 pb-4">
              <MediaTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
