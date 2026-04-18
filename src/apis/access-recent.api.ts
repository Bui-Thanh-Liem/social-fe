import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IAccessRecent } from "~/shared/interfaces/schemas/access-recent.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string.util";
import { apiCall } from "~/utils/call-api.util";

// ➕ Delete
export const useDeleteAccessRecent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { _id: string }) =>
      apiCall<boolean>(`/access-recent/${payload._id}`, {
        method: "DELETE",
      }),
    onSuccess: async (res) => {
      if ([200, 201].includes(res.statusCode)) {
        await queryClient.invalidateQueries({ queryKey: ["access-recent"] });
      }
    },
  });
};

// ➕ DELETE ALL
export const useDeleteAllAccessRecent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiCall<boolean>(`/access-recent/all`, {
        method: "DELETE",
      }),
    onSuccess: async (res) => {
      if ([200, 201].includes(res.statusCode)) {
        await queryClient.invalidateQueries({ queryKey: ["access-recent"] });
      }
    },
  });
};

// 📄 GET
export const useGetMultiAccessRecent = (queries?: IQuery<IAccessRecent>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["access-recent", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/access-recent/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IAccessRecent>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};
