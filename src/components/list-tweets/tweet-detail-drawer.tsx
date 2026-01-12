"use client";

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Heart,
  MessageCircle,
  Repeat2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetTweetChildren } from "~/apis/useFetchTweet";
import { cn } from "~/lib/utils";
import { ETweetStatus } from "~/shared/enums/status.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useCommentSocket } from "~/socket/hooks/useCommentSocket";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";
import { useUserStore } from "~/store/useUserStore";
import { ArrowLeftIcon } from "../icons/arrow-left";
import { VerifyIcon } from "../icons/verify";
import { Logo } from "../logo";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { TypingIndicator } from "../typing-indicator";
import { AvatarMain } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "../ui/drawer";
import { WrapIcon } from "../wrapIcon";
import { ActionBookmarkTweet } from "./action-bookmark-tweet";
import { ActionCommentTweet } from "./action-comment-tweet";
import { ActionLikeTweet } from "./action-like-tweet";
import { ActionRetweetQuoteTweet } from "./action-retweet-quote-tweet";
import { ActionShared } from "./action-shared";
import { Content } from "./content";
import { SkeletonTweet, StatusTag, TweetItem } from "./item-tweet";
import { formatTimeAgo } from "~/utils/date-time";

export function TweetDetailDrawer() {
  //
  const { pathname } = useLocation();

  //
  const { user } = useUserStore();
  const { tweet, close, isOpen, prevTweet, setTweet, setPrevTweet } =
    useDetailTweetStore();

  //
  const [tweetComments, setTweetComments] = useState<ITweet[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newAuthorCmt, setNewAuthorCmt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Ref for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  //
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { joinComment, leaveComment } = useCommentSocket((newComment) => {
    if (!newComment) return;

    const isMyComment =
      user?._id === (newComment.user_id as unknown as IUser)._id;

    const addCommentIfNotExists = (comment: ITweet) => {
      setTweetComments((prev) => {
        if (prev.some((tw) => tw._id === comment._id)) return prev;
        return [comment, ...prev];
      });
    };

    // Nếu là comment của chính mình → thêm luôn, không hiện typing
    if (isMyComment) {
      addCommentIfNotExists(newComment);
      return;
    }

    // Nếu người khác comment → bật typing (chỉ 1 lần)
    if (!newAuthorCmt) {
      setNewAuthorCmt((newComment.user_id as unknown as IUser).name);
    }

    // Clear timeout cũ (để tránh bị chồng typing)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Sau 2s, tắt typing và thêm comment
    typingTimeoutRef.current = setTimeout(() => {
      setNewAuthorCmt("");
      addCommentIfNotExists(newComment);
    }, 2000);
  });

  //
  useEffect(() => {
    console.log("joinComment");
    if (tweet?._id) joinComment(tweet._id);
    return () => {
      console.log("leaveComment");
      if (tweet?._id) leaveComment(tweet._id);
    };
  }, [tweet?._id]);

  //
  useEffect(() => {
    close();
  }, [close, pathname]);

  // Gọi api comments (theo page)
  const { data, isLoading: isLoadingCmm } = useGetTweetChildren({
    tweet_id: tweet?._id || "",
    tweet_type: ETweetType.Comment,
    queries: {
      page: page.toString(),
      limit: "10",
    },
  });

  // Khi có data mới => append vào list
  useEffect(() => {
    if (data?.metadata?.items) {
      const newComments = data.metadata.items as ITweet[];

      if (page === 1) {
        setTweetComments(newComments);
      } else {
        setTweetComments((prev) => {
          const existIds = new Set(prev.map((tw) => tw._id));
          const filtered = newComments.filter((tw) => !existIds.has(tw._id));
          return [...prev, ...filtered];
        });
      }

      if (newComments.length < 10) {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    }
  }, [data?.metadata?.items, page]);

  // Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoadingCmm &&
        !isLoadingMore &&
        tweetComments.length > 0
      ) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoadingCmm, isLoadingMore, tweetComments.length]
  );

  // Setup observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: "0px",
    });

    observerInstanceRef.current.observe(element);

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi đổi tweet
  useEffect(() => {
    setPage(1);
    // setTweetComments([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [tweet?._id]);

  //
  if (!tweet) {
    return <></>;
  }

  //
  const {
    content,
    user_id,
    media,
    created_at,
    mentions,
    comments_count,
    user_view,
    guest_view,
    likes_count,
    retweets_count,
    quotes_count,
  } = tweet;
  const author = user_id as unknown as IUser;

  //
  function handleClickPrev(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setTweet(prevTweet);
    setPrevTweet(undefined);
  }

  //
  function onDel(id: string) {
    setTweetComments((prev) => prev.filter((tw) => tw._id !== id));
  }

  //
  return (
    <Drawer direction="right" open={isOpen}>
      <DrawerOverlay
        className="bg-black/70"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      {/* Các phần tử nằm trên overlay, ngoài DrawerOverlay */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-3/4 z-[100] h-screen p-4 pl-28">
          {/* Content tweet */}
          <div className="h-full relative">
            {prevTweet && (
              <WrapIcon
                className="absolute -left-16 bg-gray-400 cursor-pointer hover:bg-gray-400/90 z-[2000]"
                onClick={handleClickPrev}
              >
                <ArrowLeftIcon size={24} color="#fff" />
              </WrapIcon>
            )}

            <WrapIcon
              className="absolute -left-16 bg-gray-400 cursor-pointer hover:bg-gray-400/90 z-[1000]"
              onClick={() => close()}
            >
              <X size={24} color="#fff" />
            </WrapIcon>

            <div className="h-[92%] flex items-center">
              {media ? (
                <Carousel className="w-full">
                  <CarouselContent className="h-[80vh] cursor-grab">
                    {media?.map((item) => (
                      <CarouselItem key={item.url} className="lg:basis-1/1">
                        <Card className="w-full h-full overflow-hidden flex items-center justify-center border-0 bg-transparent">
                          <CardContent className="w-full h-full p-0 flex items-center justify-center">
                            {item.file_type.includes("video/") ? (
                              <video src={item.url} controls />
                            ) : item.file_type.includes("image/") ? (
                              <img
                                src={item.url}
                                alt={item.url}
                                className="object-contain w-full h-full"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/placeholder-image.png"; // Fallback image
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-400">
                                  Định dạng không hỗ trợ
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {media?.length > 2 && (
                    <>
                      <CarouselPrevious className="left-8 text-white hover:bg-gray-400" />
                      <CarouselNext className="right-8 text-white hover:bg-gray-400" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Logo className="text-gray-400" size={300} />
                </div>
              )}
            </div>

            {/*  */}
            <div className="flex justify-center gap-28 mt-8 w-[70%] lg:w-full">
              <div className="text-white flex items-center gap-3">
                <MessageCircle size={24} />
                <span className="text-sm">{comments_count || 0}</span>
              </div>
              <div className="text-white flex items-center gap-3">
                <Repeat2 size={24} />
                <span className="text-sm">
                  {(retweets_count || 0) + (quotes_count || 0)}
                </span>
              </div>
              <div className="text-white flex items-center gap-3">
                <Heart size={24} />
                <span className="text-sm">{likes_count || 0}</span>
              </div>
              <div className="text-white flex items-center gap-3">
                <BarChart3 size={24} />
                <span className="text-sm">{user_view + guest_view}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <DrawerContent className="h-screen max-h-screen overflow-y-auto overflow-x-hidden">
        <div className="">
          {/*  */}
          <DrawerHeader>
            <StatusTag status={tweet.status} />
            <DrawerTitle className="flex items-center space-x-2">
              <div className="flex items-center mb-3">
                <AvatarMain
                  src={author.avatar}
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
                  <p className="text-sm text-gray-400">
                    {author.username} •{" "}
                    {formatTimeAgo(created_at as unknown as string)}
                  </p>
                </div>
              </div>
            </DrawerTitle>
            <DrawerDescription className="text-gray-700 text-base whitespace-break-spaces">
              <>
                <p
                  className={cn(
                    "text-gray-800 mb-3 leading-relaxed whitespace-break-spaces",
                    isExpanded ? "" : "line-clamp-10"
                  )}
                >
                  <Content content={content} mentions={mentions as any} />
                </p>
                {(content.split("\n").length > 10 || content.length > 500) && (
                  <div className="flex my-1">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="m-auto outline-none"
                    >
                      <WrapIcon className="bg-gray-100">
                        {isExpanded ? (
                          <ArrowUp size={20} className="text-blue-400" />
                        ) : (
                          <ArrowDown size={20} className="text-blue-400" />
                        )}
                      </WrapIcon>
                    </button>
                  </div>
                )}
              </>
            </DrawerDescription>
          </DrawerHeader>

          {/* ACTIONS */}
          <div
            className={cn(
              "p-4 sticky -top-4 bg-white z-50",
              tweet.status !== ETweetStatus.Ready
                ? "cursor-not-allowed pointer-events-none"
                : ""
            )}
          >
            <div className="flex items-center justify-between text-gray-500 border-y border-gray-100 py-3">
              {/* Comment */}
              <ActionCommentTweet tweet={tweet} />

              {/* Retweet and Quote */}
              <ActionRetweetQuoteTweet tweet={tweet} />

              {/* Likes */}
              <ActionLikeTweet tweet={tweet} />

              {/* Bookmark and Shared */}
              <div className="flex items-center space-x-1">
                <ActionBookmarkTweet tweet={tweet} />
                <ActionShared tweet={tweet} />
              </div>
            </div>
          </div>

          <TypingIndicator show={!!newAuthorCmt} authorName={newAuthorCmt} />
          {/* COMMENTS */}
          <div>
            {tweetComments?.length ? (
              tweetComments.map((tw) => {
                return (
                  <TweetItem tweet={tw} key={tw._id} onSuccessDel={onDel} />
                );
              })
            ) : isLoadingCmm ? (
              <SkeletonTweet />
            ) : (
              <div className="flex h-24">
                <p className="m-auto text-gray-400 text-sm">
                  Chưa có bình luận
                </p>
              </div>
            )}
          </div>

          {/* Loading more */}
          {isLoadingMore && (
            <div className="py-4">
              <SkeletonTweet />
            </div>
          )}

          {/* Observer element */}
          <div ref={observerRef} className="h-10 w-full" />

          {/* End message */}
          {!hasMore && tweetComments.length > 0 && (
            <div className="text-center py-6 mb-6">
              <p className="text-gray-500">
                🎉 Bạn đã xem hết tất cả bình luận!
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
