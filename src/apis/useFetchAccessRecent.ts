import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IAccessRecent } from "~/shared/interfaces/schemas/access-recent.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST
export const useDeleteAccessRecent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { _id: string }) =>
      apiCall<IAccessRecent>(`/access-recent/${payload._id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["access-recent"] }),
      ]);
    },
  });
};

// ➕ POST
export const useDeleteAllAccessRecent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiCall<IAccessRecent>(`/access-recent/all`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["access-recent"] }),
      ]);
    },
  });
};

// 📄 GET
export const useGetMultiAccessRecent = (queries?: IQuery<IAccessRecent>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["access-recent", queries?.q, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/access-recent/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IAccessRecent>>(url);
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
