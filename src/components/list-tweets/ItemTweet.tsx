import { BarChart3, CornerRightDown, Flag, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useReportTweet } from "~/apis/useFetchReport";
import { useDeleteTweet, useGetDetailTweet } from "~/apis/useFetchTweet";
import { cn } from "~/lib/utils";
import { ETweetStatus } from "~/shared/enums/status.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";
import { useUserStore } from "~/store/useUserStore";
import { DotIcon } from "../icons/dot";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WrapIcon } from "../WrapIcon";
import { ActionBookmarkTweet } from "./ActionBookmarkTweet";
import { ActionCommentTweet } from "./ActionCommentTweet";
import { ActionLikeTweet } from "./ActionLikeTweet";
import { ActionRetweetQuoteTweet } from "./ActionRetweetQuoteTweet";
import { ActionShared } from "./ActionShared";
import { formatTimeAgo } from "~/utils/date-time";
import { handleResponse } from "~/utils/toast";
import { ContentExpanded } from "./Content";

// Component cho Medias (Image hoặc Video)
export const MediaContent = ({ tweet }: { tweet: ITweet }) => {
  const { medias } = tweet;

  //
  const { open, setTweet } = useDetailTweetStore();

  //
  function handleClickMedia() {
    open();
    if (tweet) {
      setTweet(tweet);
    }
  }

  if (!medias || !medias.length) return <></>;

  return (
    <div
      className={cn("", tweet ? "cursor-pointer" : "")}
      onClick={handleClickMedia}
    >
      <Carousel className="w-full">
        <CarouselContent className="h-full cursor-grab">
          {medias?.map((item) => (
            <CarouselItem
              key={item.url}
              className={cn(
                "md:basis-1/2 lg:basis-1/1",
                medias.length >= 2 ? "lg:basis-1/2" : "",
              )}
            >
              <Card className="w-full h-full overflow-hidden flex items-center justify-center border bg-transparent">
                <CardContent className="w-full h-full p-0 flex items-center justify-center">
                  {item.file_type?.includes("video/") ? (
                    <video src={item?.url} controls />
                  ) : item.file_type?.includes("image/") ? (
                    <img
                      loading="lazy"
                      src={item?.url}
                      alt={item?.file_name}
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400">Định dạng không hỗ trợ</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

//
export const SkeletonTweet = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="animate-pulse px-4 py-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 my-3"></div>
          <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex space-x-6">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

//
export const TweetItem = ({
  tweet,
  isAction = true,
  onSuccessDel,
}: {
  tweet: ITweet;
  isAction?: boolean;
  onSuccessDel: (id: string) => void;
}) => {
  const {
    _id,
    content,
    user_id,
    mentions,
    user_view,
    parent_id,
    created_at,
    guest_view,
    community_id,
  } = tweet;

  //
  const author = user_id as unknown as IUser;
  const community = community_id as unknown as ICommunity;
  const pathname = window.location.pathname;
  const isComment = !pathname?.includes("/tweet/");

  // Gọi api detail để lấy các retweet/quoteTweet
  const { data } = useGetDetailTweet(parent_id || "");

  //
  const quoteTweet = data?.metadata ? data?.metadata : ({} as ITweet);
  const quoteTweet_user = quoteTweet.user_id as unknown as IUser;

  return (
    <div key={_id} className="px-4 py-2 group hover:bg-gray-50 relative group">
      {/* Header với thông tin người dùng */}
      {community?.name && (
        <div>
          <Link
            to={`/communities/${community.slug}`}
            className="text-gray-500 hover:underline text-md"
          >
            {community?.name}
          </Link>
          <CornerRightDown className="inline-block ml-2 mt-2" size={14} />
          <StatusTag status={tweet.status} className="inline-block ml-4" />
        </div>
      )}
      <div className="flex items-center mb-3">
        <AvatarMain
          src={author.avatar?.url}
          alt={author.name}
          className="mr-3"
        />
        <div>
          <ShortInfoProfile profile={tweet.user_id as unknown as IUser}>
            <Link
              to={`/${author.username}`}
              className="flex items-center gap-2"
            >
              <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                {author.name}
              </h3>
              <VerifyIcon active={!!author.verify} size={20} />
            </Link>
          </ShortInfoProfile>
          <p className="text-sm text-gray-500">
            {author.username} • {formatTimeAgo(created_at as unknown as string)}
          </p>
        </div>
        <div className="ml-auto">
          <TweetAction tweet={tweet} onSuccessDel={onSuccessDel} />
        </div>
      </div>

      <div className="ml-14">
        {/* Nội dung tweet */}
        {content && tweet.type !== ETweetType.Retweet && (
          <ContentExpanded content={content} mentions={mentions as any} />
        )}

        {/* Medias content */}
        {tweet.type !== ETweetType.Retweet && <MediaContent tweet={tweet} />}

        {/* QuoteTweet and Retweet */}
        {tweet.type === ETweetType.QuoteTweet ||
        tweet.type === ETweetType.Retweet ? (
          <div className="border border-gray-300 rounded-2xl p-3 pb-0">
            {/* Header với thông tin người dùng */}
            <div className="flex items-center mb-3">
              <AvatarMain
                src={quoteTweet_user?.avatar?.url}
                alt={quoteTweet_user?.name}
                className="mr-3"
              />
              <div>
                <ShortInfoProfile profile={quoteTweet_user}>
                  <Link
                    to={`/${quoteTweet_user?.username}`}
                    className="flex items-center gap-2"
                  >
                    <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                      {quoteTweet_user?.name}
                    </h3>
                    <VerifyIcon active={!!quoteTweet_user?.verify} size={20} />
                  </Link>
                </ShortInfoProfile>
                <p className="text-sm text-gray-500">
                  {quoteTweet_user?.username} •{" "}
                  {formatTimeAgo(quoteTweet.created_at as unknown as string)}
                </p>
              </div>
            </div>

            {/* Nội dung tweet */}
            <div className="ml-14">
              {quoteTweet?.content && (
                <ContentExpanded
                  content={quoteTweet?.content}
                  mentions={quoteTweet?.mentions as unknown as IUser[]}
                />
              )}
              {/* Medias content */}
              <MediaContent tweet={quoteTweet} />
            </div>
          </div>
        ) : null}

        {/* Engagement Bar */}
        {isAction && (
          <div
            className={cn(
              "flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3",
              tweet.status !== ETweetStatus.Ready
                ? "cursor-not-allowed pointer-events-none"
                : "",
            )}
          >
            {/* Comment */}
            {isComment && <ActionCommentTweet tweet={tweet} />}

            {/* Retweet and Quote */}
            <ActionRetweetQuoteTweet tweet={tweet} />

            {/* Likes */}
            <ActionLikeTweet tweet={tweet} />

            {/* Views */}
            <button className="flex items-center space-x-2 hover:text-orange-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-orange-50 transition-colors">
                <BarChart3 size={18} />
              </div>
              <span className="text-sm">{user_view + guest_view}</span>
            </button>

            {/* Bookmark and Shared */}
            <div className="flex items-center space-x-1">
              <ActionBookmarkTweet tweet={tweet} />
              <ActionShared tweet={tweet} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//
function TweetAction({
  tweet,
  onSuccessDel,
}: {
  tweet: ITweet;
  onSuccessDel: (id: string) => void;
}) {
  const { user } = useUserStore();
  const author = tweet?.user_id as unknown as IUser;
  const apiDeleteTweet = useDeleteTweet();
  const apiReportTweet = useReportTweet();

  // Gỡ bài viết (xoá)
  async function onDel() {
    const resDeleted = await apiDeleteTweet.mutateAsync(tweet._id);
    handleResponse(resDeleted, () => {
      onSuccessDel(tweet._id);
    });
  }

  // Báo cáo bài viết
  async function onReport() {
    const resDeleted = await apiReportTweet.mutateAsync(tweet._id);
    handleResponse(resDeleted, () => {
      onSuccessDel(tweet._id);
    });
  }

  return (
    <div className="relative">
      <div className="relative w-16 h-6 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 flex items-center justify-end rounded-full outline-0
                     opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                     transition-opacity duration-150"
            >
              <WrapIcon>
                <DotIcon size={16} />
              </WrapIcon>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="right"
            sideOffset={6}
            className="rounded-2xl px-0"
          >
            {user?._id === author?._id ? (
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onDel}
              >
                <Trash className="w-3 h-3" color="var(--color-red-400)" />
                <p className="text-red-400 text-sm">Gỡ bài viết</p>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer px-3 font-semibold space-x-1"
                onClick={onReport}
              >
                <Flag className="w-3 h-3" color="var(--color-red-400)" />
                <p className="text-red-400 text-sm">Báo cáo</p>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

//
export function StatusTag({
  status,
  className,
}: {
  status: ETweetStatus;
  className?: string;
}) {
  if (status === ETweetStatus.Ready) return null;
  const _status = {
    [ETweetStatus.Pending]: (
      <div className="bg-orange-500 text-white font-medium inline-block rounded-2xl px-1.5 py-0.5">
        <p className="text-xs">Chờ duyệt</p>
      </div>
    ),
    [ETweetStatus.Reject]: (
      <div className="bg-red-500 text-white font-medium inline-block rounded-2xl px-1.5 py-0.5">
        <p className="text-xs">Từ chối</p>
      </div>
    ),
  };

  return <div className={className}>{_status[status]}</div>;
}
