import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ResToggleBookmark } from "~/shared/dtos/res/bookmark.dto";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { apiCall } from "~/utils/call-api.util";
import { handleResponseOnlyErr } from "~/utils/toast";

export const useBookmarkTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      tweetId: string,
    ): Promise<OkResponse<ResToggleBookmark>> => {
      return apiCall<ResToggleBookmark>(`/bookmarks/${tweetId}`, {
        method: "POST",
      });
    },

    onMutate: async (tweetId: string) => {
      // ✅ Cancel tất cả queries liên quan
      await queryClient.cancelQueries({
        queryKey: ["tweets", "feeds"],
        exact: false,
      });

      // ✅ Snapshot TẤT CẢ queries có chứa feeds
      const previousFeedsData = queryClient.getQueriesData<
        OkResponse<ResMultiType<ITweet>>
      >({
        queryKey: ["tweets", "feeds"],
        exact: false,
      });

      const previousDetailData = queryClient.getQueryData<OkResponse<ITweet>>([
        "tweet",
        tweetId,
      ]);

      // ✅ QUAN TRỌNG: Update function sẽ tìm và update tweet ở BẤT KỲ page nào
      const updateTweetInFeeds = (
        old: OkResponse<ResMultiType<ITweet>> | undefined,
      ) => {
        if (!old?.metadata?.items) return old;

        // Tìm tweet trong page này
        const tweetIndex = old.metadata.items.findIndex(
          (tweet) => tweet._id === tweetId,
        );

        if (tweetIndex === -1) {
          // Tweet không có trong page này → return nguyên vẹn
          return old;
        }

        // Tweet có trong page này → update
        return {
          ...old,
          metadata: {
            ...old.metadata,
            items: old.metadata.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                return {
                  ...tweet,
                  is_bookmark: !(tweet.is_bookmark ?? false), // Toggle bookmark
                };
              }
              return tweet;
            }),
          },
        };
      };

      // ✅ Apply cho TẤT CẢ feeds pages
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "feeds"], exact: false },
        updateTweetInFeeds,
      );

      // ✅ Update profile tweets nếu có
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "profile"], exact: false },
        updateTweetInFeeds,
      );

      // ✅ Update tweet children nếu có
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "children"], exact: false },
        updateTweetInFeeds,
      );

      // ✅ Update detail
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.metadata) return old;

          return {
            ...old,
            metadata: {
              ...old.metadata,
              is_bookmark: !(old.metadata.is_bookmark ?? false),
            },
          };
        },
      );

      // ✅ Update bookmarked list - Remove khi unbookmark
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "bookmarked"], exact: false },
        (old) => {
          if (!old?.metadata?.items) return old;

          const tweetIndex = old.metadata.items.findIndex(
            (tweet) => tweet._id === tweetId,
          );

          if (tweetIndex !== -1) {
            // Remove từ bookmarked list khi unbookmark
            return {
              ...old,
              metadata: {
                ...old.metadata,
                items: old.metadata.items.filter(
                  (tweet) => tweet._id !== tweetId,
                ),
                total: Math.max(0, old.metadata.total - 1),
              },
            };
          }

          return old; // Không thêm vào bookmarked list (cần full tweet data)
        },
      );

      return { previousFeedsData, previousDetailData, tweetId };
    },

    onError: (err, tweetId, context) => {
      // ✅ Rollback TẤT CẢ changes
      if (context?.previousFeedsData) {
        context.previousFeedsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetailData) {
        queryClient.setQueryData(
          ["tweet", tweetId],
          context.previousDetailData,
        );
      }

      // Force refetch để đảm bảo consistency
      queryClient.invalidateQueries({
        queryKey: ["tweets", "bookmarked"],
      });

      console.error("Bookmark failed:", err);
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (res, tweetId) => {
      //
      if (![200, 201].includes(res.statusCode)) {
        handleResponseOnlyErr(res);
        return;
      }

      const isNowBookmarked = res.metadata?.status === "Bookmark";

      // ✅ Sync từ server cho TẤT CẢ pages
      const syncTweetInFeeds = (
        old: OkResponse<ResMultiType<ITweet>> | undefined,
      ) => {
        if (!old?.metadata?.items) return old;

        const tweetIndex = old.metadata.items.findIndex(
          (tweet) => tweet._id === tweetId,
        );

        if (tweetIndex === -1) return old;

        return {
          ...old,
          metadata: {
            ...old.metadata,
            items: old.metadata.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                return {
                  ...tweet,
                  is_bookmark: isNowBookmarked,
                };
              }
              return tweet;
            }),
          },
        };
      };

      // Apply sync cho tất cả feeds
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "feeds"], exact: false },
        syncTweetInFeeds,
      );

      // Apply sync cho profile tweets
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "profile"], exact: false },
        syncTweetInFeeds,
      );

      // Apply sync cho tweet children
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "children"], exact: false },
        syncTweetInFeeds,
      );

      // Sync detail
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.metadata) return old;

          return {
            ...old,
            metadata: {
              ...old.metadata,
              is_bookmark: isNowBookmarked,
            },
          };
        },
      );

      // ✅ QUAN TRỌNG: Invalidate bookmarked list để refetch fresh data
      if (isNowBookmarked) {
        // Nếu bookmark → cần fresh data cho bookmarked list
        queryClient.invalidateQueries({
          queryKey: ["tweets", "bookmarked"],
        });
      }
    },

    onSettled: () => {
      // ✅ Optional: Có thể thêm toast notification
      // toast.success("Bookmark updated!");
    },
  });
};
