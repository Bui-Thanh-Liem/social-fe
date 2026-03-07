import { useQuery } from "@tanstack/react-query";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IAccessRecent } from "~/shared/interfaces/schemas/access-recent.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

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
