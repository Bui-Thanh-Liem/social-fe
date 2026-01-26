import { Check, ListCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VerifyIcon } from "~/components/icons/verify";
import { MediaContent } from "~/components/list-tweets/ItemTweet";
import { AvatarMain } from "~/components/ui/avatar";
import { DialogMain } from "~/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from "~/components/ui/item";
import { WrapIcon } from "~/components/WrapIcon";
import { useChangeStatusTweet } from "~/apis/useFetchCommunity";
import { useGetTweetsPendingByCommunityId } from "~/apis/useFetchTweet";
import { cn } from "~/lib/utils";
import { ETweetStatus } from "~/shared/enums/status.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function TweetApproveSkeleton() {
  return (
    <div className="p-2 border rounded-md animate-pulse space-y-3">
      <div className="flex gap-2">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-muted" />

        <div className="flex-1 space-y-2">
          {/* Name + verify icon */}
          <div className="w-32 h-4 bg-muted rounded" />
          {/* Username */}
          <div className="w-24 h-3 bg-muted rounded" />
          {/* Bio */}
          <div className="w-56 h-3 bg-muted rounded" />
          <div className="w-40 h-3 bg-muted rounded" />
        </div>
      </div>

      {/* Tweet content */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-muted rounded" />
        <div className="w-4/5 h-3 bg-muted rounded" />
        <div className="w-3/5 h-3 bg-muted rounded" />
      </div>

      {/* Media */}
      <div className="w-full aspect-video bg-muted rounded-lg" />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <div className="w-8 h-8 bg-muted rounded-md" />
        <div className="w-8 h-8 bg-muted rounded-md" />
      </div>
    </div>
  );
}

export function CommunityApprove({
  count,
  community,
}: {
  community: ICommunity;
  count: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  //
  const total_page_ref = useRef(0);
  const { data, isLoading } = useGetTweetsPendingByCommunityId(
    {
      page: page.toString(),
      limit: "10",
      community_id: community._id,
    },
    isOpen,
  );
  const apiChangeStatusTweet = useChangeStatusTweet();

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1) {
      setTweets(items);
    } else {
      setTweets((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString()),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setTweets([]);
    };
  }, []);

  //
  if (!community.is_admin && !community.is_mentor) return null;

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  async function handleChangeStatusTweet(
    tweet_id: string,
    status: ETweetStatus,
  ) {
    const res = await apiChangeStatusTweet.mutateAsync({
      status,
      tweet_id,
      community_id: community._id,
    });
    if (res.statusCode === 200) {
      // Xoá tweet khỏi list
      setTweets((prev) => prev.filter((t) => t._id !== tweet_id));
    }
  }

  //
  return (
    <>
      <WrapIcon className="relative border" onClick={() => setIsOpen(true)}>
        <ListCheck size={18} />
        <p className="absolute -top-1 -right-1 text-[10px] bg-sky-400 w-4 h-4 rounded-full text-center text-white">
          {count}
        </p>
      </WrapIcon>

      <DialogMain
        textHeader="Bài viết cần duyệt"
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        width="3xl"
      >
        <div className="space-y-3">
          {tweets.map((tweet) => {
            const user = tweet.user_id as unknown as IUser;

            return (
              <Item
                asChild
                size="sm"
                key={tweet._id}
                variant="outline"
                className="group p-2"
              >
                <div>
                  <ItemMedia>
                    <div className="flex gap-2">
                      <AvatarMain src={user?.avatar?.url} alt={user?.name} />
                      <div>
                        <Link
                          to={`/${user?.username}`}
                          className="flex items-center gap-2"
                        >
                          <p className="text-sm leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
                            {user.name}
                            <VerifyIcon active={!!user.verify} size={20} />
                          </p>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {user.username}
                        </p>
                        {user.bio && (
                          <p className="line-clamp-3 max-w-[95%]">{user.bio}</p>
                        )}
                      </div>
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription className="line-clamp-6">
                      {tweet.content}
                    </ItemDescription>
                    <ItemDescription className="pointer-events-none">
                      <MediaContent tweet={tweet} />
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <WrapIcon
                      onClick={() =>
                        handleChangeStatusTweet(tweet._id, ETweetStatus.Reject)
                      }
                    >
                      <X className="text-red-400" />
                    </WrapIcon>
                    <WrapIcon
                      onClick={() =>
                        handleChangeStatusTweet(tweet._id, ETweetStatus.Ready)
                      }
                    >
                      <Check className="text-green-400" />
                    </WrapIcon>
                  </ItemActions>
                </div>
              </Item>
            );
          })}

          {/*  */}
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <TweetApproveSkeleton key={`more-${i}`} />
              ))
            : !!tweets.length && (
                <div className="px-4 py-3">
                  <p
                    className={cn(
                      "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                      total_page_ref.current <= page
                        ? "text-gray-300 pointer-events-none cursor-default"
                        : "",
                    )}
                    onClick={onSeeMore}
                  >
                    Xem thêm
                  </p>
                </div>
              )}

          {/*  */}
          {!isLoading && tweets.length === 0 && page === 1 && (
            <p className="p-4 text-center text-gray-400">Chưa có bài viết</p>
          )}
        </div>
      </DialogMain>
    </>
  );
}
