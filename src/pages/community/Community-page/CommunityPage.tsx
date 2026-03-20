import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneCommunityBySlug } from "~/apis/useFetchCommunity";
import { ErrorResponse } from "~/components/Error";
import { VerifyIcon } from "~/components/icons/verify";
import { Tweet } from "~/components/tweet/Tweet";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { SearchMain } from "~/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/WrapIcon";
import { useDebounce } from "~/hooks/useDebounce";
import { ETweetType, EVisibilityType } from "~/shared/enums/type.enum";
import { useCommunitySocket } from "~/socket/hooks/useCommunitySocket";
import { useReloadStore } from "~/store/useReloadStore";
import { useTriggerAccessRecentStore } from "~/store/useTriggerAccessRecentStore";
import { formatDateToDateVN } from "~/utils/dateTime";
import { playNotificationSound } from "~/utils/notificationSound";
import { ProfileSkeleton } from "../../profile/ProfilePage";
import { CommunityActivity } from "./actions/CommunityActivity";
import { CommunityApprove } from "./actions/CommunityApprove";
import { CommunityInfo } from "./actions/CommunityInfo";
import { CommunityInvite } from "./actions/CommunityInvite";
import { CommunityInvitedList } from "./actions/CommunityInvitedList";
import { CommunityJoinLeave } from "./actions/CommunityJoinLeave";
import { CommunitySetting } from "./actions/CommunitySetting";
import { Bio } from "./actions/EditBio";
import { CommunityMedia } from "./CommunityMedia";
import { CommunityTweets } from "./CommunityTweets";

export function CommunityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

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

  //
  useEffect(() => {
    if (slug) {
      trigger(); // Gọi lại API khi slug thay đổi
    }
  }, [slug]);

  //
  useEffect(() => {
    if (community?._id) {
      joinCommunity(community._id);
      console.log("joinCommunity");
    }
    return () => {
      if (community?._id) {
        console.log("joinCommunity");
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
            <div className="flex h-12 items-center gap-4">
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

        {/*  */}
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
        {(data?.statusCode === 404 || !community) && (
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              Không tìm thấy cộng đồng.
            </h2>
            <p className="text-gray-500">
              {slug} không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        )}

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
