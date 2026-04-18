import { useMutation, useQuery } from "@tanstack/react-query";
import type { ENotificationType } from "~/shared/enums/type.enum";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string.util";
import { apiCall } from "~/utils/call-api.util";

// 📄 GET
export const useGetMultiByType = ({
  queries,
  type,
}: {
  queries: IQuery<INotification>;
  type: ENotificationType;
}) => {
  return useQuery({
    queryKey: ["conversations", type, queries?.page],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/notifications/${type}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<INotification>>(url);
    },

    // Các options bổ sung
    staleTime: 10000, // ✅ QUAN TRỌNG: Tăng lên 10 giây để tránh refetch ngay lập tức
    refetchOnWindowFocus: false, // ✅ Tắt refetch khi focus để tránh ghi đè optimistic update
    refetchOnMount: false, // ✅ Tắt refetch khi mount

    // 🔥 THÊM CẤU HÌNH NÀY:
    refetchOnReconnect: false,
    refetchInterval: false,
    // Quan trọng: Đảm bảo không conflict với optimistic update
    networkMode: "online",
  });
};

// ❌ DELETE - Xóa
export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (noti_id: string) =>
      apiCall<boolean>(`/notifications/${noti_id}`, {
        method: "DELETE",
      }),
  });
};

// 🦴 PATCH - Đọc
export const useReadNotification = () => {
  return useMutation({
    mutationFn: (noti_id: string) =>
      apiCall<boolean>(`/notifications/read/${noti_id}`, {
        method: "PATCH",
      }),
  });
};
