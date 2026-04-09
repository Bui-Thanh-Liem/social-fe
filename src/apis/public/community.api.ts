import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChangeInfoDto,
  ChangeStatusTweetInCommunityDto,
  CreateCommunityDto,
  deleteInvitationDto,
  DemoteMentorDto,
  InvitationMembersDto,
  JoinLeaveCommunityDto,
  PinCommunityDto,
  PromoteMentorDto,
  UpdateDto,
} from "~/shared/dtos/req/community.dto";
import { ETweetStatus } from "~/shared/enums/status.enum";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type {
  ICommunity,
  ICommunityActivity,
  ICommunityInvitation,
} from "~/shared/interfaces/schemas/community.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string";
import { apiCall } from "~/utils/call-api.util";

// 📄 GET
export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["communities", "categories"],
    queryFn: () => {
      const url = `/communities/categories`;
      return apiCall<string[]>(url);
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

// 📄 GET
export const useGetAllBareCommunities = () => {
  return useQuery({
    queryKey: ["communities", "bare"],
    queryFn: () => {
      const url = `/communities/bare`;
      return apiCall<ICommunity[]>(url);
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

// 📄 GET
export const useGetAllPinnedBareCommunities = () => {
  return useQuery({
    queryKey: ["communities", "pinned-bare"],
    queryFn: () => {
      const url = `/communities/pinned-bare`;
      return apiCall<ICommunity[]>(url);
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

// 🚪 GET - Get bare Community By slug
export const useGetOneCommunityBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: () => apiCall<ICommunity>(`/communities/slug/${slug}`),
    enabled: enabled && !!slug,
  });
};

// 🚪 GET - Get members mentors Community By id
export const useGetMultiMMCommunityById = (
  id: string,
  queries: IQuery<ICommunity>,
  enabled = true,
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";
  const queryString = queries ? buildQueryString(queries) : "";

  return useQuery({
    queryKey: ["community", "mm", id, queries.q, normalizedQueries],
    queryFn: () =>
      apiCall<ICommunity>(
        `/communities/mm/${id}${queryString ? `?${queryString}` : ""}`,
      ),
    enabled: enabled && !!id,
  });
};

// 🚪 GET - Get activity Community By id
export const useGetMultiActivities = (
  id: string,
  queries: IQuery<ICommunity>,
  enabled = true,
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";
  const queryString = queries ? buildQueryString(queries) : "";

  return useQuery({
    queryKey: ["community", "activity", id, queries.q, normalizedQueries],
    queryFn: () =>
      apiCall<ResMultiType<ICommunityActivity>>(
        `/communities/activity/${id}${queryString ? `?${queryString}` : ""}`,
      ),
    enabled: enabled && !!id,
  });
};

// 📄 GET - lấy những lời mời đã mời
export const useGetMultiInvitations = (
  community_id: string,
  queries?: IQuery<ICommunity>,
  enabled = true,
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["invited", community_id, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/invite/${community_id}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ICommunityInvitation>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    enabled: enabled && !!community_id,
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
export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: deleteInvitationDto) =>
      apiCall<boolean>(
        `/communities/invite/${payload.invitation_id}/${payload.community_id}`,
        {
          method: "DELETE",
        },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invited"] });
    },
  });
};

// 📄 GET
export const useGetMultiCommunitiesOwner = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "communities",
      "owner",
      queries?.q,
      queries?.qe,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/owner/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ICommunity>>(url);
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

// 📄 GET
export const useGetMultiCommunitiesJoined = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "communities",
      "joined",
      queries?.q,
      queries?.qe,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/joined/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ICommunity>>(url);
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

// 📄 GET
export const useGetMultiCommunities = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "communities",
      "explore",
      queries?.q,
      queries?.qe,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/explore/${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ICommunity>>(url);
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

// ➕ POST
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommunityDto) =>
      apiCall<ICommunity>("/communities", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ POST
export const useInviteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InvitationMembersDto) =>
      apiCall<ICommunity>("/communities/invite-members", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invited"] });
      await queryClient.invalidateQueries({
        queryKey: ["communities", "bare"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["communities", "activities"],
      });
    },
  });
};

// ➕ POST
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinLeaveCommunityDto) =>
      apiCall<boolean>(`/communities/join/${payload.community_id}`, {
        method: "POST",
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ POST
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinLeaveCommunityDto) =>
      apiCall<boolean>(`/communities/leave/${payload.community_id}`, {
        method: "POST",
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ POST
export const usePromoteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromoteMentorDto) =>
      apiCall<boolean>(`/communities/promote/`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ POST
export const useDemoteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DemoteMentorDto) =>
      apiCall<boolean>(`/communities/demote/`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ POST
export const useChangeStatusTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeStatusTweetInCommunityDto) =>
      apiCall<boolean>(`/communities/change-status/`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async (_, { status }) => {
      // Invalidate danh sách communities
      if (status !== ETweetStatus.Ready) {
        await queryClient.invalidateQueries({
          queryKey: ["tweets", "community"],
        });
      }
    },
  });
};

// ➕ PATCH
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDto) =>
      apiCall<boolean>(`/communities/update/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ PATCH
export const useChangeInfoCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { payload: ChangeInfoDto; id: string }) =>
      apiCall<boolean>(`/communities/change-info/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]);
    },
  });
};

// ➕ PATCH
export const useTogglePinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PinCommunityDto) =>
      apiCall<ICommunity>(`/communities/toggle-pin/${payload.community_id}`, {
        method: "PATCH",
      }),
    onSuccess: async () => {
      // Invalidate danh sách communities
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
        queryClient.invalidateQueries({
          queryKey: ["communities", "pinned-bare"],
        }),
      ]);
    },
  });
};
