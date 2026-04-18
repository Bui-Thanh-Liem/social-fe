import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/tweet-item";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/wrap-icon";
import { useGetTweetsByIds } from "~/apis/trending.api";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useTrendingStore } from "~/storage/use-trending.storage";
import { Content } from "~/components/list-tweets/content";
import { formatTimeAgo } from "~/utils/date-time.util";
import { ArrowLeft } from "lucide-react";

export function TrendingPage() {
  // Metadata
  useEffect(() => {
    document.title = "Thịnh hành";
  }, []);

  const navigate = useNavigate();
  const { trendingItem } = useTrendingStore();
  const highlight = trendingItem?.highlight;
  const relevant_ids = trendingItem?.relevant_ids || [];

  const [limit, setLimit] = useState(5);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error, isFetching } = useGetTweetsByIds({
    ids: relevant_ids.slice(0, limit),
  });

  // Cập nhật danh sách khi fetch thành công
  useEffect(() => {
    if (data?.statusCode === 200) {
      setAllTweets(data.metadata || []);
    }
  }, [data]);

  // Xử lý xóa tweet thành công
  const onSuccessDel = (id: string) => {
    setAllTweets((prev) => prev.filter((tw) => tw._id !== id));
  };

  // Infinite Scroll với Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setLimit((prev) => {
          const next = prev + 5;
          return next <= relevant_ids.length ? next : prev;
        });
      }
    },
    [isFetching, relevant_ids.length],
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "0px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [handleObserver]);

  const loading = isLoading || isFetching;

  return (
    <div className="grid grid-cols-12 max-h-[calc(100vh-60px)] overflow-y-auto">
      <div className="col-span-0 xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 sticky top-0 z-10 bg-white">
          <div className="flex h-12 items-center gap-2">
            <WrapIcon onClick={() => navigate(-1)}>
              <ArrowLeft color="#000" />
            </WrapIcon>
            <p className="font-semibold text-[20px]">Thịnh hành</p>
          </div>
        </div>

        <div>
          {/* Summary */}
          <div>
            <ul className="my-3 px-8 space-y-3 list-disc text-[14px]">
              {highlight?.map((h, i) => (
                <li key={h._id}>
                  <p>
                    <p className="leading-relaxed whitespace-break-spaces break-words [word-break:break-word] [hyphens:auto]">
                      <Content content={h.content} mentions={[]} />
                    </p>
                    <Avatar
                      key={`${h.avatar}-${i}`}
                      className="inline-block ml-4 w-5 h-5"
                    >
                      <AvatarImage src={h.avatar?.url} alt={h.content} />
                      <AvatarFallback>{h.avatar?.url}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs ml-2 text-gray-400">
                      {formatTimeAgo(h.created_at as unknown as string)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
            <hr />
          </div>

          {/* Tweets list */}
          <div className="mt-4">
            {isLoading && limit === 5 && <SkeletonTweet />}

            {!isLoading && !error && allTweets.length === 0 && limit === 5 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">
                  📭 Chưa có nội dung nào
                </p>
              </div>
            )}

            {allTweets.length > 0 && (
              <div className="space-y-4">
                {allTweets.map((tweet) => (
                  <TweetItem
                    key={tweet._id}
                    tweet={tweet}
                    onSuccessDel={onSuccessDel}
                  />
                ))}
              </div>
            )}

            {/* Loading more indicator */}
            {loading && (
              <div className="py-4">
                <SkeletonTweet />
              </div>
            )}

            {/* Loader */}
            {limit < relevant_ids.length && (
              <div ref={loaderRef} className="text-center py-6" />
            )}

            {/* End of list */}
            {limit >= relevant_ids.length && !isFetching && (
              <div className="text-center py-8 pb-12">
                <p className="text-gray-500">
                  🎉 Bạn đã xem hết tất cả nội dung!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
