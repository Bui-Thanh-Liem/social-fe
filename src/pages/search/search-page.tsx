import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItemMain } from "~/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAddQuery } from "~/hooks/use-add-query";
import { useRemoveQuery } from "~/hooks/use-remove-query";
import { useUpdateQuery } from "~/hooks/use-update-query";
import { CommunityTab } from "./community-tab";
import { MediaTab } from "./media-tab";
import { PeopleTab } from "./people-tab";
import { TopTab } from "./top-tab";
import { TweetTab } from "./tweet-tab";

export function SearchPage() {
  const updateQuery = useUpdateQuery();
  const addQuery = useAddQuery();
  const removeQuery = useRemoveQuery();

  //
  function handleChange(value: string) {
    if (value === "off") return removeQuery("pf");
    addQuery({ pf: value });
  }

  return (
    <div className="grid grid-cols-12 overflow-y-auto h-[calc(100vh-114px)]">
      <div className="col-span-0 hidden lg:block xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10">
        <Tabs defaultValue="top">
          {/* Tab List */}
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

          {/*  */}
          <div className="block xl:hidden">
            <RadioGroup
              defaultValue="off"
              onValueChange={handleChange}
              className="py-2"
            >
              <div className="flex items-center justify-between gap-x-3">
                <RadioGroupItemMain value="off" id="off" />
                <Label htmlFor="off" className="cursor-pointer flex-1">
                  Từ bất kỳ ai
                </Label>
              </div>
              <div className="flex items-center justify-between gap-x-3">
                <RadioGroupItemMain value="on" id="on" />
                <Label htmlFor="on" className="cursor-pointer flex-1">
                  Những người bạn theo dõi
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tab Content */}
          <div className="pt-0">
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
