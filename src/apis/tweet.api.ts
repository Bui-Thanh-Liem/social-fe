import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateTweetDto } from "~/shared/dtos/req/tweet.dto";
import type {
  ResCountViewLinkBookmarkInWeek,
  ResCreateTweet,
} from "~/shared/dtos/res/tweet.dto";
import type { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { useReloadStore } from "~/storage/use-reload.storage";
import { buildQueryString } from "~/utils/build-query-string.util";
import { apiCall } from "~/utils/call-api.util";

// ➕ POST - Tạo tweet mới
export const useCreateTweet = () => {
  return useMutation({
    mutationFn: (payload: CreateTweetDto) =>
      apiCall<ResCreateTweet>("/tweets", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

// ❌ DELETE - Xóa tweet
export const useDeleteTweet = () => {
  return useMutation({
    mutationFn: (tweet_id: string) =>
      apiCall<boolean>(`/tweets/${tweet_id}`, {
        method: "DELETE",
      }),
  });
};

// 📄 GET - Lấy tweets mới nhất theo type feed: all - everyone - following
export const useGetNewFeeds = (
  feed_type: EFeedType,
  queries?: IQuery<ITweet>,
) => {
  const { reloadKey } = useReloadStore();
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets", "feeds", feed_type, reloadKey, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/feeds/${feed_type}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Các options bổ sung
    staleTime: 5 * 60 * 1000, // Trong 5p thì không gọi lại API
    gcTime: 10 * 60 * 1000, // Trong cache 10 phút không component nào dùng thì xoá

    refetchOnWindowFocus: true, // khi người dùng quay lại tab/browser, React Query có nên tự động refetch không.
    refetchOnMount: "always", // khi component mount lại, React Query có nên refetch không.

    //
    refetchOnReconnect: false, // có tự động refetch lại query khi kết nối mạng trở lại hay không.
    refetchInterval: false,
    networkMode: "online", // chỉ fetch khi có mạng
  });
};

// 📄 GET - Lấy chi tiết 1 tweet
export const useGetDetailTweet = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["tweet", id],
    queryFn: () => apiCall<ITweet>(`/tweets/${id}`),
    enabled: enabled && !!id,
  });
};

// 📄 GET - Lấy tweets của chính mình trong profile
export const useGetProfileTweets = (
  tweet_type: ETweetType,
  queries?: IQuery<ITweet> & {
    ishl?: "0" | "1";
    isMedia?: "1" | "0";
  },
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "tweets",
      "profile",
      queries?.user_id,
      tweet_type,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/profile/${tweet_type}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy tweets bằng community_id
export const useGetCommunityTweets = (
  queries?: IQuery<ITweet> & {
    ishl?: "0" | "1";
    isMedia?: "1" | "0";
  },
) => {
  const { reloadKey } = useReloadStore();
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "tweets",
      "community",
      reloadKey,
      queries?.community_id,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/community/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy tweets bằng community_id và status = pending
export const useGetTweetsPendingByCommunityId = (
  queries?: IQuery<ITweet>,
  enabled = true,
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "tweets",
      "community",
      "pending",
      queries?.community_id,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/community/pending/${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    enabled: enabled && !!queries?.community_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy tweets con của một tweet
export const useGetTweetChildren = ({
  tweet_id,
  tweet_type,
  queries,
}: {
  tweet_id: string;
  tweet_type: ETweetType;
  queries?: IQuery<ITweet>;
}) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets", "children", tweet_id, tweet_type, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/${tweet_id}/${tweet_type}/children${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    enabled: Boolean(tweet_id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy tweet đã like
export const useGetTweetLiked = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets", "liked", queries?.user_id, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/liked/${queryString ? `?${queryString}` : ""}`;

      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy tweet đã Bookmarked
export const useGetTweetBookmarked = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets", "bookmarked", queries?.user_id, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/bookmarked/${queryString ? `?${queryString}` : ""}`;

      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Thống kê lượt xem, thích, lưu trong tuần
export const useCountViewLinkBookmarkInWeek = () => {
  return useQuery({
    queryKey: ["tweets", "count-view-like-bookmark-week"],
    queryFn: () =>
      apiCall<ResCountViewLinkBookmarkInWeek>(`/tweets/view-like-bookmark`),

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};
