import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/ItemTweet";
import { Tweet } from "~/components/tweet/Tweet";
import { TypingIndicator } from "~/components/TypingIndicator";
import { WrapIcon } from "~/components/WrapIcon";
import { useGetDetailTweet, useGetTweetChildren } from "~/apis/useFetchTweet";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useCommentSocket } from "~/socket/hooks/useCommentSocket";
import { useUserStore } from "~/store/useUserStore";
import { Logo } from "~/components/Logo";
import { ButtonMain } from "~/components/ui/button";
import { useBackUrlStore } from "~/store/useBackUrlStore";

export function TweetDetailPage() {
  //
  const navigate = useNavigate();
  const { tweet_id } = useParams(); // Đặt tên params ở <App />

  //
  const [tweetComments, setTweetComments] = useState<ITweet[]>([]);
  const { user } = useUserStore();
  const { setBackUrl } = useBackUrlStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newAuthorCmt, setNewAuthorCmt] = useState("");

  // Ref cho infinite scroll
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

  // Xoá comment khỏi list
  function onDel(id: string) {
    setTweetComments((prev) => prev.filter((tw) => tw._id !== id));
  }

  // Back
  function onBack() {
    if (window.history.length <= 3) {
      navigate("/");
      return;
    }
    navigate(-1);
  }

  //
  function onClickLogin() {
    setBackUrl(window.location.pathname + window.location.search);
    navigate("/");
  }

  //
  if (isLoadingDetail) {
    return <SkeletonTweet />;
  }

  // Not found
  const tweet = tweetDetail?.metadata || null;
  if (tweetDetail?.statusCode === 404 || !tweet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-10">
        <Logo size={64} className="mb-4" />

        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy bài viết
        </h2>
        <p className="text-gray-500 text-center">
          {tweetDetail?.message || "Bài viết không tồn tại hoặc đã bị xóa"}
        </p>

        <div className="space-x-4">
          <ButtonMain onClick={() => navigate("/")}>Trang Chủ</ButtonMain>
          <ButtonMain variant={"outline"} onClick={() => navigate(0)}>
            Tải lại
          </ButtonMain>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={onBack}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Bài viết</p>
        </div>
        <Logo size={36} />
        {!user && (
          <div>
            <ButtonMain size="sm" className="w-full" onClick={onClickLogin}>
              Đăng nhập
            </ButtonMain>
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-50px)] max-h-[calc(100vh-50px)] overflow-y-auto pb-6">
        <TweetItem tweet={tweet} onSuccessDel={() => {}} />

        {/*  */}
        <div className="p-4 border-y border-gray-100 pb-0">
          <Tweet
            tweet={tweet}
            contentBtn="Bình luận"
            tweetType={ETweetType.Comment}
            placeholder="Đăng bình luận của bạn"
          />
        </div>

        <TypingIndicator show={!!newAuthorCmt} authorName={newAuthorCmt} />

        {/* COMMENTS */}
        <div className="ml-14">
          {tweetComments?.length ? (
            tweetComments.map((tw) => {
              return <TweetItem tweet={tw} key={tw._id} onSuccessDel={onDel} />;
            })
          ) : isLoadingCmm ? (
            <SkeletonTweet />
          ) : (
            <div className="flex h-24">
              <p className="m-auto text-gray-400 text-sm">Chưa có bình luận</p>
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
            <p className="text-gray-500">🎉 Bạn đã xem hết tất cả bình luận!</p>
          </div>
        )}
      </div>
    </>
  );
}
