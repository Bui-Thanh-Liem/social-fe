import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ParamIdDto } from "~/shared/dtos/req/common/param-id.dto";
import type { CreateSearchHistoryDto } from "~/shared/dtos/req/search-history.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ISearchHistory } from "~/shared/interfaces/schemas/search-history.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string.util";
import { apiCall } from "~/utils/call-api.util";

// ➕ POST
export const useCreateSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Function thực hiện call API
    mutationFn: async (
      payload: CreateSearchHistoryDto,
    ): Promise<OkResponse<boolean>> => {
      return apiCall<boolean>("/search-history", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    // Chạy SAU khi gọi api (thành công)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
};

// 📄 GET
export const useGetMultiSearchHistory = (queries?: IQuery<ISearchHistory>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["search-history", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/search-history${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ISearchHistory>>(url);
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

// ❌ DELETE
export const useDeleteSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ParamIdDto) =>
      apiCall<ISearchHistory>(`/search-history/${payload.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      // Invalidate danh sách search-history
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
};
