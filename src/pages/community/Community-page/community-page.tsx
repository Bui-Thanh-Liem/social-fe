import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneCommunityBySlug } from "~/apis/community.api";
import { ErrorResponse } from "~/components/state/error";
import { VerifyIcon } from "~/components/icons/verify";
import { NotThing } from "~/components/state/not-thing";
import { Tweet } from "~/components/tweet/tweet";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { SearchMain } from "~/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrap-icon";
import { useDebounce } from "~/hooks/use-debounce";
import { ETweetType, EVisibilityType } from "~/shared/enums/type.enum";
import { useCommunitySocket } from "~/socket/hooks/use-community-socket";
import { useReloadStore } from "~/storage/use-reload.storage";
import { useTriggerAccessRecentStore } from "~/storage/use-trigger-access-recent.storage";
import { formatDateToDateVN } from "~/utils/date-time.util";
import { playNotificationSound } from "~/utils/notification-sound.util";
import { ProfileSkeleton } from "../../profile/profile-page";
import { CommunityActivity } from "./actions/community-activity";
import { CommunityApprove } from "./actions/community-approve";
import { CommunityInfo } from "./actions/community-info";
import { CommunityInvite } from "./actions/community-invite";
import { CommunityInvitedList } from "./actions/community-invited-list";
import { CommunityJoinLeave } from "./actions/community-join-leave";
import { CommunitySetting } from "./actions/community-setting";
import { Bio } from "./actions/edit-bio";
import { CommunityMedia } from "./community-media";
import { CommunityTweets } from "./community-tweets";

export function CommunityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Metadata
  useEffect(() => {
    document.title = slug ? `Cộng đồng ${slug}` : "Cộng đồng";
  }, [slug]);

  //
  const { triggerReload } = useReloadStore();
  const { trigger } = useTriggerAccessRecentStore();
  const [countTweetApprove, setCountTweetApprove] = useState(0);
  const [isOpenPost, setIsOpenPost] = useState(false);

  //
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 800);

  //
  const { data, refetch, isLoading, error } = useGetOneCommunityBySlug(slug!);
  const community = data?.metadata;

  //
  const { joinCommunity, leaveCommunity } = useCommunitySocket((count) => {
    //
    if (countTweetApprove < count) {
      playNotificationSound();
    }
    setCountTweetApprove(count);
  });

  // Gọi lại API khi slug thay đổi
  useEffect(() => {
    if (slug) {
      trigger(); // Gọi lại API khi slug thay đổi
    }
  }, [slug]);

  //
  useEffect(() => {
    if (community?._id) {
      joinCommunity(community._id);
    }
    return () => {
      if (community?._id) {
        leaveCommunity(community._id);
      }
    };
  }, [community?._id]);

  //
  function handleOpenPost() {
    setIsOpenPost(true);
  }

  //
  function onSuccessPost() {
    setIsOpenPost(false);
    triggerReload();
  }

  return (
    <div className="grid grid-cols-12 max-h-[calc(100vh-60px)] overflow-y-auto">
      <div className="col-span-0 xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10">
        {/* Header */}
        <div className="pr-3 sticky top-0 z-50 bg-white">
          <div className="flex h-12 items-center gap-4">
            <div className="flex h-12 items-center gap-2">
              <WrapIcon onClick={() => navigate(-1)}>
                <ArrowLeft color="#000" />
              </WrapIcon>
              <p className="font-semibold text-[20px] line-clamp-1">
                {community?.name}
              </p>
            </div>

            {community?.is_joined && (
              <div className="ml-auto flex items-center gap-x-3 ">
                <SearchMain
                  size="sm"
                  value={searchVal}
                  onChange={setSearchVal}
                  onClear={() => setSearchVal("")}
                />
                <ButtonMain size="sm" onClick={handleOpenPost}>
                  Đăng Bài
                </ButtonMain>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Photo cover */}
          <div className="w-full h-60 border-b border-gray-100">
            {community?.cover ? (
              <img
                src={community?.cover.url || "/favicon.png"}
                alt="Cover Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-300 w-full h-full" />
            )}
          </div>

          {/* Community Section */}
          {community && (
            <div className="px-4 mt-4">
              {/* <!-- Name and Category --> */}
              <div className="justify-between flex">
                <h2 className="text-xl font-bold items-center gap-1 hidden md:flex">
                  {community?.name}{" "}
                  <VerifyIcon
                    active={!!community?.verify}
                    size={20}
                    color="orange"
                  />
                </h2>
                <div className="flex items-center gap-3">
                  {/*  */}
                  <CommunitySetting community={community} />

                  {/*  */}
                  <CommunityApprove
                    community={community}
                    count={countTweetApprove}
                  />

                  {/*  */}
                  <CommunityActivity community={community} />

                  {/*  */}
                  <CommunityInvitedList community={community} />

                  {/*  */}
                  <CommunityInfo community={community} />

                  {/*  */}
                  <CommunityInvite community={community} />

                  {/*  */}
                  <CommunityJoinLeave community={community} />
                </div>
              </div>
              <div className="my-3 px-3 rounded-2xl border inline-block">
                <span className="text-[15px] font-medium">
                  {community?.category}
                </span>
              </div>

              {/* <!-- Bio --> */}
              <Bio
                community={{
                  _id: community?._id || "",
                  bio: community?.bio || "",
                  is_admin: community?.is_admin || false,
                }}
              />

              {/* <!-- Join Date --> */}
              <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Đã tạo{" "}
                    {formatDateToDateVN(new Date(community?.created_at || ""))}
                  </span>
                </div>
              </div>

              {/* <!-- Members --> */}
              <div className="flex items-center space-x-2 text-sm mb-4">
                <span className="font-semibold">{community.member_count}</span>
                <span className="text-gray-500"> thành viên</span>
              </div>
            </div>
          )}

          {/* Tweets and medias*/}
          {community?.visibility_type === EVisibilityType.Public ||
          community?.is_joined ? (
            <Tabs defaultValue={ETweetType.Tweet.toString()}>
              <div className="bg-white sticky mt-4 top-12 z-50">
                <TabsList className="w-full">
                  <TabsTrigger
                    className="cursor-pointer"
                    value={ETweetType.Tweet.toString()}
                  >
                    Bài viết
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="highlights">
                    Nổi bật
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer line-clamp-1"
                    value="media"
                  >
                    Hình ảnh/video
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="pt-0">
                <TabsContent
                  value={ETweetType.Tweet.toString()}
                  className="px-0 py-4"
                >
                  <div className="space-y-4">
                    <CommunityTweets
                      community_id={community._id}
                      q={debouncedSearchVal}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="highlights" className="px-0 py-4">
                  <div className="space-y-4">
                    <CommunityTweets
                      community_id={community._id}
                      ishl="1"
                      q={debouncedSearchVal}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="px-0 py-4">
                  <div className="space-y-4">
                    <CommunityMedia community_id={community._id} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center flex-col pt-32 border-t border-gray-100">
              <p className="text-gray-500 text-lg mb-2">
                ✋ Cộng đồng này là riêng tư ✋
              </p>
              <p className="text-gray-400">
                Chỉ xem được nội dung khi bạn là thành viên.
              </p>
            </div>
          )}
        </div>

        {/*  */}
        {isLoading && !data && <ProfileSkeleton />}

        {/*  */}
        {(data?.statusCode === 404 || !community) && <NotThing />}

        {/*  */}
        {error && <ErrorResponse onRetry={() => refetch()} />}
      </div>

      {/*  */}
      <DialogMain
        width="2xl"
        isLogo={false}
        open={isOpenPost}
        onOpenChange={setIsOpenPost}
      >
        <Tweet
          contentBtn="Đăng bài"
          onSuccess={onSuccessPost}
          community={community?._id}
          tweetType={ETweetType.Tweet}
          placeholder="Đăng bài trong cộng đồng"
        />
      </DialogMain>
    </div>
  );
}
