import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/ItemTweet";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/WhoToFollowItem";
import { useGetMultiCommunities } from "~/apis/useFetchCommunity";
import { useSearchTweets, useSearchUsers } from "~/apis/useFetchSearch";
import { cn } from "~/lib/utils";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { CommunityRow, CommunityRowSkeleton } from "../community/CommunityRow";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function TopTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");
  const top = searchParams.get("top");

  const [pageUser, setPageUser] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const [pageTweet, setPageTweet] = useState(1);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const [pageCommunity, setPageCommunity] = useState(1);
  const [communities, setCommunities] = useState<ICommunity[]>([]);

  const total_page_user_ref = useRef(0);
  const { data, isLoading, refetch } = useSearchUsers({
    page: pageUser.toString(),
    limit: "4",
    q: q ?? "",
    pf: pf ?? "",
    top: top ?? "",
  });

  const total_page_community_ref = useRef(0);
  const {
    data: dataCommunities,
    isLoading: isLoadingCommunity,
    refetch: refetchCommunity,
  } = useGetMultiCommunities({
    page: pageUser.toString(),
    limit: "4",
    q: q ?? "",
  });

  const total_page_tweet_ref = useRef(0);
  const {
    data: dataTweets,
    isLoading: isLoadingTweets,
    refetch: refetchTweets,
    isFetching: isFetchingTweets,
  } = useSearchTweets({
    limit: "10",
    q: q ?? "",
    pf: pf ?? "",
    page: pageTweet.toString(),
  });

  //
  useEffect(() => {
    setUsers([]);
    setTweets([]);
    setPageUser(1);
    setPageTweet(1);
    refetch();
    refetchTweets();
    refetchCommunity();
  }, [q, pf, f]);

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_user_ref.current = total_page || 0;

    if (items) {
      setUsers((prev) => {
        // Loại bỏ duplicate tweets dựa trên _id
        const existingIds = new Set(prev.map((u) => u._id));
        const filteredNewUsers = items.filter(
          (tweet) => !existingIds.has(tweet._id),
        );
        return [...prev, ...filteredNewUsers];
      });
    }
  }, [data?.metadata]);

  useEffect(() => {
    const items = dataTweets?.metadata?.items || [];
    const total_page = dataTweets?.metadata?.total_page;
    total_page_tweet_ref.current = total_page || 0;

    if (items) {
      setTweets((prev) => {
        // Loại bỏ duplicate tweets dựa trên _id
        const existingIds = new Set(prev.map((tweet) => tweet._id));

        const filteredNewTweets = items.filter(
          (tweet) => !existingIds.has(tweet._id),
        );

        return [...prev, ...filteredNewTweets];
      });
    }
  }, [dataTweets?.metadata]);

  useEffect(() => {
    const items = dataCommunities?.metadata?.items || [];
    const total_page = dataCommunities?.metadata?.total_page;
    total_page_community_ref.current = total_page || 0;

    if (items) {
      setCommunities((prev) => {
        // Loại bỏ duplicate tweets dựa trên _id
        const existingIds = new Set(prev.map((com) => com._id));

        const filteredNewCommunities = items.filter(
          (com) => !existingIds.has(com._id),
        );

        return [...prev, ...filteredNewCommunities];
      });
    }
  }, [dataTweets?.metadata]);

  //
  useEffect(() => {
    return () => {
      setUsers([]);
      setTweets([]);
      setPageUser(1);
      setPageTweet(1);
    };
  }, []);

  //
  function onSeeMoreUser() {
    setPageUser((prev) => prev + 1);
  }

  //
  function onSeeMoreTweet() {
    setPageTweet((prev) => prev + 1);
  }

  function onDel(id: string) {
    setTweets((prev) => prev.filter((tw) => tw._id !== id));
  }

  //
  function onSeeMoreCommunity() {
    setPageCommunity((prev) => prev + 1);
  }

  const loadingTweet = isFetchingTweets || isLoadingTweets;

  return (
    <div className="max-h-[calc(100vh-(150px))] overflow-y-auto">
      <div>
        {/*  */}
        <div>
          {users.map((item) => (
            <UserToFollowItem key={item._id} user={item} />
          ))}
        </div>

        {/*  */}
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <UserToFollowItemSkeleton key={`more-${i}`} />
            ))
          : !!users.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_user_ref.current <= pageUser
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : "",
                  )}
                  onClick={onSeeMoreUser}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {/*  */}
        {!users.length && !isLoading && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500 text-lg">
              Không có người dùng nào phù hợp với <strong>"{q}"</strong>
            </p>
          </div>
        )}
      </div>
      <hr className="my-4" />
      <div>
        {/* Tweets list */}
        {tweets.length > 0 && (
          <div className="space-y-6">
            {tweets.map((tweet, index: number) => (
              <span key={tweet._id}>
                <TweetItem tweet={tweet} onSuccessDel={onDel} />
                {index < tweets.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </span>
            ))}
          </div>
        )}

        {/*  */}
        {loadingTweet
          ? Array.from({ length: 2 }).map((_, i) => (
              <SkeletonTweet key={`more-${i}`} />
            ))
          : !!tweets.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_tweet_ref.current <= pageTweet
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : "",
                  )}
                  onClick={onSeeMoreTweet}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {/*  */}
        {!tweets.length && !loadingTweet && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500 text-lg">
              Không có bài viết nào phù hợp với <strong>"{q}"</strong>
            </p>
          </div>
        )}
      </div>
      <hr className="my-4" />
      <div>
        {/* Communities list */}
        {communities.length > 0 && (
          <div className="space-y-6">
            {communities.map((com, index: number) => (
              <span key={com._id}>
                <CommunityRow community={com} />
                {index < tweets.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </span>
            ))}
          </div>
        )}

        {/*  */}
        {isLoadingCommunity
          ? Array.from({ length: 2 }).map((_, i) => (
              <CommunityRowSkeleton key={`more-${i}`} />
            ))
          : !!tweets.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_community_ref.current <= pageCommunity
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : "",
                  )}
                  onClick={onSeeMoreCommunity}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {/*  */}
        {!communities.length && !isLoadingCommunity && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500 text-lg">
              Không có cộng đồng nào phù hợp với <strong>"{q}"</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
