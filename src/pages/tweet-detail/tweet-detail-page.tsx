import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetDetailTweet, useGetTweetChildren } from "~/apis/tweet.api";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/tweet-item";
import { NotThing } from "~/components/state/not-thing";
import { Tweet } from "~/components/tweet/tweet";
import { TypingIndicator } from "~/components/typing-indicator";
import { Card, CardContent } from "~/components/ui/card";
import { WrapIcon } from "~/components/wrap-icon";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useCommentSocket } from "~/socket/hooks/useCommentSocket";
import { useUserStore } from "~/store/useUserStore";

export function TweetDetailPage() {
  //
  const navigate = useNavigate();
  const location = useLocation();
  const { tweet_id } = useParams(); // Đặt tên params ở <App />

  //
  const [tweetComments, setTweetComments] = useState<ITweet[]>([]);
  const { user } = useUserStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newAuthorCmt, setNewAuthorCmt] = useState("");

  // Ref cho infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  //
  const typingTimeoutRef = useRef<any | null>(null);
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
    console.log("newComment:::", newComment);

    typingTimeoutRef.current = setTimeout(() => {
      setNewAuthorCmt("");
      addCommentIfNotExists(newComment);
    }, 2000);
  });

  //
  useEffect(() => {
    console.log("joinComment");
    if (tweet_id) joinComment(tweet_id);
    return () => {
      console.log("leaveComment");
      if (tweet_id) leaveComment(tweet_id);
    };
  }, [joinComment, leaveComment, tweet_id]);

  //
  const { data: tweetDetail, isLoading: isLoadingDetail } = useGetDetailTweet(
    tweet_id!,
  );
  const tweet = tweetDetail?.metadata || null;

  // API comments (theo page)
  const { data: comments, isLoading: isLoadingCmm } = useGetTweetChildren({
    tweet_id: tweet_id!,
    tweet_type: ETweetType.Comment,
    queries: {
      page: page.toString(),
      limit: "10",
    },
  });

  // Khi có data mới => append vào list
  useEffect(() => {
    if (comments?.metadata?.items) {
      const newComments = comments.metadata.items as ITweet[];

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
  }, [comments, page]);

  // Observer callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    [hasMore, isLoadingCmm, isLoadingMore, tweetComments.length],
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
  }, [tweet_id]);

  //
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài nếu cần

    // KIỂM TRA: Nếu có backgroundLocation tức là họ mở từ Feed -> Back lại là an toàn
    if (location.state?.backgroundLocation) {
      navigate(-1);
    } else {
      // Nếu không có state (vào trực tiếp bằng link) -> Đẩy về trang chủ
      navigate("/", { replace: true });
    }
  };

  // Xoá comment khỏi list
  function onDel(id: string) {
    setTweetComments((prev) => prev.filter((tw) => tw._id !== id));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
      <Card className="relative">
        <WrapIcon
          className="absolute -top-2 -right-2 bg-gray-50 p-1 lg:p-2 lg:-top-4 lg:-right-4"
          onClick={handleClose}
        >
          <X />
        </WrapIcon>
        <CardContent className="h-[80vh] overflow-y-auto w-[94vw] lg:w-[54vw] bg-white px-1 lg:px-4">
          {isLoadingDetail && <SkeletonTweet />}

          {(tweetDetail?.statusCode === 404 || !tweet) && <NotThing />}

          {tweetDetail?.statusCode === 403 && (
            <NotThing
              title="Bạn chưa tham gia vào cộng đồng"
              description={tweetDetail?.message}
            />
          )}

          {/*  */}
          {tweet && (
            <TweetItem
              tweet={tweet}
              isClickable={false}
              onSuccessDel={() => {
                navigate(-1);
              }}
            />
          )}

          {/*  */}
          {tweet && (
            <div className="p-4 pb-0 sticky top-0 bg-white z-10">
              <Tweet
                tweet={tweet}
                contentBtn="Bình luận"
                tweetType={ETweetType.Comment}
                placeholder="Đăng bình luận của bạn"
              />
            </div>
          )}

          <TypingIndicator show={!!newAuthorCmt} authorName={newAuthorCmt} />

          {/* COMMENTS */}
          {tweetDetail?.metadata && (
            <div className="space-y-4">
              {tweetComments?.length ? (
                tweetComments.map((tw) => {
                  return (
                    <TweetItem
                      tweet={tw}
                      key={tw._id}
                      onSuccessDel={onDel}
                      // isClickable={false}
                    />
                  );
                })
              ) : isLoadingCmm ? (
                <SkeletonTweet />
              ) : (
                <NotThing />
              )}
            </div>
          )}

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
        </CardContent>
      </Card>
    </div>
  );
}
