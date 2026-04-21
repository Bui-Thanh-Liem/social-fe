import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  UpdateMeDto,
} from "~/shared/dtos/req/user-auth.dto";
import type { ResLoginUser } from "~/shared/dtos/res/auth.dto";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { connectSocket, socket, disconnectSocket } from "~/socket/socket";
import { useBackLinkStore } from "~/storage/use-back-link.storage";
import { useUserStore } from "~/storage/use-user.storage";
import { apiCall } from "~/utils/call-api.util";
import { deleteStorageClient } from "~/utils/delete-storage-client";

// 🔐 POST - Register
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const getMe = useGetMe();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterUserDto) =>
      apiCall<ResLoginUser>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      if (data.statusCode === 201) {
        // Lưu token
        localStorage.setItem("access_token", data.metadata?.access_token || "");
        localStorage.setItem(
          "refresh_token",
          data.metadata?.refresh_token || "",
        );

        // Invalidate user data để refetch
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
        (async () => {
          const resGetMe = await getMe.mutateAsync();
          if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
            setUser(resGetMe.metadata);
            connectSocket();
            socket.emit(
              CONSTANT_EVENT_NAMES.JOIN_CONVERSATION,
              resGetMe.metadata._id,
            );
          }
        })();

        //
        navigate("/");
      }
    },
  });
};

// 🔐 POST - Login
export const useUserLogin = () => {
  const getMe = useGetMe();
  const { setUser } = useUserStore();
  const { link } = useBackLinkStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginUserDto) =>
      apiCall<ResLoginUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        // Lưu token
        localStorage.setItem("access_token", data.metadata?.access_token || "");
        localStorage.setItem(
          "refresh_token",
          data.metadata?.refresh_token || "",
        );

        // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
        (async () => {
          const resGetMe = await getMe.mutateAsync();
          if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
            setUser(resGetMe.metadata);
            connectSocket();
            socket.emit(
              CONSTANT_EVENT_NAMES.JOIN_CONVERSATION,
              resGetMe.metadata._id,
            );
            console.log("connectSocket after login");
          }
        })();

        //
        navigate(link || "/", { replace: true });
      }
    },
  });
};

// 🚪 POST - Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();
  const { link } = useBackLinkStore();
  const navigate = useNavigate();
  const refresh_token = localStorage.getItem("refresh_token");

  return useMutation({
    mutationFn: () =>
      apiCall<boolean>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      }),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        // Xóa token
        deleteStorageClient();

        // Clear toàn bộ cache
        queryClient.clear();

        // Xóa dữ liệu Store global
        clearUser();

        // Ngắt kết nối socket khi logout
        disconnectSocket();

        //
        navigate(link || "/", { replace: true });
      }
    },
  });
};

// 🚪 GET - Get Me
export const useGetMe = () => {
  return useMutation({
    mutationFn: () => apiCall<IUser>("/auth/me", { method: "GET" }),
    onSuccess: () => {},
  });
};

// 🔐 PATCH - UPDATE ME
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();

  return useMutation({
    mutationFn: (credentials: UpdateMeDto) =>
      apiCall<IUser>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (_data, variables) => {
      //
      queryClient.invalidateQueries({
        queryKey: ["user", variables.username],
      });

      //
      if (_data.statusCode === 200 && _data?.metadata) {
        setUser({
          ...user,
          ..._data.metadata,
        });
      }
    },
  });
};

// 🔐 POST - ForgotPassword
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordDto) =>
      apiCall<ResLoginUser>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {},
  });
};

// 🔐 POST - ResetPassword
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordDto) =>
      apiCall<ResLoginUser>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {},
  });
};
