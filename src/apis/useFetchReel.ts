import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateReelDto } from "~/shared/dtos/req/reel.dto";
import type { ResCreateReel } from "~/shared/dtos/res/reel.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IReel } from "~/shared/interfaces/schemas/reel.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST - Tạo reel mới
export const useCreateReel = () => {
  return useMutation({
    mutationFn: (payload: CreateReelDto) =>
      apiCall<ResCreateReel>("/reels", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

// 📄 GET - Lấy reels mới nhất theo type feed: all - everyone - following
export const useGetNewFeeds = (queries?: IQuery<IReel>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["reels", "feeds", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/reels/feeds${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IReel>>(url);
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
