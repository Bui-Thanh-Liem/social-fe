import { Calendar, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { VerifyIcon } from "~/components/icons/verify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/WrapIcon";
import { useGetOneCommunityBySlug } from "~/apis/useFetchCommunity";
import { ETweetType, EVisibilityType } from "~/shared/enums/type.enum";
import { formatDateToDateVN } from "~/utils/date-time";
import { ProfileSkeleton } from "../../profile/ProfilePage";
import { CommunityInfo } from "./actions/CommunityInfo";
import { CommunityInvite } from "./actions/CommunityInvite";
import { CommunityJoinLeave } from "./actions/CommunityJoinLeave";
import { CommunitySetting } from "./actions/CommunitySetting";
import { CommunityActivity } from "./actions/CommunityActivity";
import { CommunityInvitedList } from "./actions/CommunityInvitedList";
import { CommunityTweets } from "./CommunityTweets";
import { CommunityMedia } from "./CommunityMedia";
import { CommunityApprove } from "./actions/CommunityApprove";
import { useCommunitySocket } from "~/socket/hooks/useCommunitySocket";
import { playNotificationSound } from "~/utils/notificationSound";
import { useEffect, useState } from "react";
import { ErrorResponse } from "~/components/Error";
import { Button, ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { Tweet } from "~/components/tweet/Tweet";
import { useReloadStore } from "~/store/useReloadStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toastSimple } from "~/utils/toast";

export function CommunityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  //
  const { triggerReload } = useReloadStore();
  const [countTweetApprove, setCountTweetApprove] = useState(0);
  const [isOpenPost, setIsOpenPost] = useState(false);

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
  function handleClickEditBio() {
    toastSimple("Chức năng đang phát triển", "info");
  }

  //
  function onSuccessPost() {
    setIsOpenPost(false);
    triggerReload();
  }

  // Error handling
  if (error) {
    return <ErrorResponse onRetry={() => refetch()} />;
  }

  // Loading state
  if (isLoading && !data) {
    return <ProfileSkeleton />;
  }

  // Community not found
  if (data?.statusCode === 404 || !community) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy cộng đồng.
        </h2>
        <p className="text-gray-500">{slug} không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="px-3 border border-gray-100">
          <div className="flex h-12 items-center gap-4">
            <WrapIcon onClick={() => navigate(-1)}>
              <ArrowLeftIcon color="#000" />
            </WrapIcon>
            <p className="font-semibold text-[18px] md:text-[20px]">
              {community?.name}
            </p>
            {community.is_joined && (
              <ButtonMain
                size="sm"
                onClick={handleOpenPost}
                className="ml-auto"
              >
                Đăng Bài
              </ButtonMain>
            )}
          </div>
        </div>

        {/*  */}
        <div className="max-h-screen overflow-y-auto scrollbar-hide">
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
            <div className="mb-3 flex items-center gap-x-1">
              <p className="leading-relaxed whitespace-break-spaces">
                {community?.bio}
              </p>
              {community.is_admin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleClickEditBio}>
                      <WrapIcon>
                        <Pencil size={14} />
                      </WrapIcon>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      Cập nhật thông tin để tối ưu tìm kiếm cộng đồng của bạn
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

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

          {/* Tweets and medias*/}
          {community.visibility_type === EVisibilityType.Public ||
          community.is_joined ? (
            <Tabs defaultValue={ETweetType.Tweet.toString()} className="mb-12">
              <div className="bg-white sticky mt-4 top-0 z-50">
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
                  <TabsTrigger className="cursor-pointer" value="media">
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
                    <CommunityTweets community_id={community._id} />
                  </div>
                </TabsContent>

                <TabsContent value="highlights" className="px-0 py-4">
                  <div className="space-y-4">
                    <CommunityTweets community_id={community._id} ishl="1" />
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
    </>
  );
}
