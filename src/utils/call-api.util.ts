import type { OkResponse } from "~/shared/classes/response.class";
import type { ResLoginUser } from "~/shared/dtos/res/auth.dto";
import { useUserStore } from "~/storage/use-user.storage";
import { deleteStorageClient } from "./delete-storage-client";

const apiUrl = import.meta.env.VITE_SERVER_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const apiCall = async <T>(
  endpoint: string,
  options: any = {},
  isClientId: boolean = false,
): Promise<OkResponse<T>> => {
  const user = useUserStore.getState().user;
  const access_token = localStorage.getItem("access_token");

  // Tạo headers object
  const headers: HeadersInit = {
    Authorization: access_token ? `Bearer ${access_token}` : "",
  };

  //
  if (isClientId && user) {
    headers["x-client-id"] = user?._id || "";
  }

  // CHỈ set Content-Type cho non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // Nếu là FormData, để browser tự động set Content-Type với boundary

  const config = {
    method: "GET",
    ...options, // Spread options trước
    headers: {
      ...headers,
      ...options.headers, // Allow override từ options
      "x-api-key": apiKey, // Add API key to headers
    },
  };

  // Initial API call
  let response = await fetch(`${apiUrl}${endpoint}`, config);
  // console.log("Đang gọi api::", `${apiUrl}${endpoint}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result = (await response.json()) as OkResponse<any>;

  // Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
  if (
    result.statusCode === 401 &&
    result.message === "TokenExpiredError: jwt expired"
  ) {
    console.log("Token đã hết hạn tiến hành refresh");

    // Fix: Get refresh_token, not access_token again
    const refresh_token = localStorage.getItem("refresh_token") || "";

    // Fix: Proper fetch call with headers
    const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ refresh_token }),
    });

    const resRefreshToken =
      (await refreshResponse.json()) as OkResponse<ResLoginUser>;

    if (resRefreshToken?.statusCode === 200) {
      localStorage.setItem(
        "access_token",
        resRefreshToken.metadata?.access_token || "",
      );
      localStorage.setItem(
        "refresh_token",
        resRefreshToken.metadata?.refresh_token || "",
      );

      // Update the Authorization header with new token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${resRefreshToken.metadata?.access_token}`,
      };

      // Retry the original request with new token
      response = await fetch(`${apiUrl}${endpoint}`, config);
      result = await response.json();
    } else {
      deleteStorageClient();
    }
  } else if ([401, 403].includes(result.statusCode)) {
    deleteStorageClient();
  }

  return result;
};
