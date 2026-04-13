import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AddParticipantsBodyDto,
  CreateConversationDto,
  DeleteConversationDto,
  PinConversationDto,
  PromoteMentorBodyDto,
  ReadConversationDto,
  RemoveParticipantsBodyDto,
} from "~/shared/dtos/req/conversation.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string";
import { apiCall } from "~/utils/call-api.util";
import { handleResponseOnlyErr } from "~/utils/toast";

// ➕ POST
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationDto) =>
      apiCall<IConversation>("/conversations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      //
      if (![200, 201].includes(res.statusCode)) {
        handleResponseOnlyErr(res);
        return;
      }

      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ POST
export const useAddParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddParticipantsBodyDto;
    }) =>
      apiCall<IConversation>(`/conversations/add-participants/${id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ POST
export const useRemoveParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RemoveParticipantsBodyDto;
    }) =>
      apiCall<IConversation>(`/conversations/remove-participants/${id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ POST
export const usePromoteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PromoteMentorBodyDto;
    }) =>
      apiCall<IConversation>(`/conversations/promote/${id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ PATCH
export const useReadConversation = () => {
  return useMutation({
    mutationFn: (payload: ReadConversationDto) =>
      apiCall<IConversation>(`/conversations/read/${payload.conversation_id}`, {
        method: "PATCH",
      }),
    onSuccess: () => {},
  });
};

// ➕ PATCH
export const useTogglePinConversation = () => {
  return useMutation({
    mutationFn: (payload: PinConversationDto) =>
      apiCall<IConversation>(
        `/conversations/toggle-pin/${payload.conversation_id}`,
        {
          method: "PATCH",
        },
      ),
    onSuccess: () => {},
  });
};

// ❌ DELETE
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteConversationDto) =>
      apiCall<IConversation>(`/conversations/${payload.conversation_id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// 📄 GET
export const useGetMultiConversations = (queries?: IQuery<IConversation>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["conversations", queries?.q, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/conversations/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IConversation>>(url);
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
