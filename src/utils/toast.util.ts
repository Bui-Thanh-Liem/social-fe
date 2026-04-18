import { toast } from "sonner";
import type { OkResponse } from "~/shared/classes/response.class";
import { formatDateToDateVN } from "./date-time.util";

type ToastType = "success" | "error" | "warning" | "info";

// Handle response with success and error toasts
export function handleResponse(
  res: OkResponse<any | boolean>,
  ...SuccessCallbacks: ((val?: unknown) => void)[]
) {
  const { statusCode, message } = res;

  if ([200, 201].includes(statusCode)) {
    SuccessCallbacks.forEach((fn) => fn());
    toast.success(message, {
      // position: "top-center",
      description: formatDateToDateVN(new Date()),
      richColors: true,
    });
  } else {
    if (typeof res.message === "string")
      toast.error(message?.replace("Error:", ""), {
        // position: "top-center",
        description: formatDateToDateVN(new Date()),
        richColors: true,
      });
  }
}

// Handle response with only error toast
export function handleResponseOnlyErr(res: OkResponse<any | boolean>) {
  const { statusCode, message } = res;

  if (![200, 201].includes(statusCode)) {
    if (typeof res.message === "string")
      toast.error(message?.replace("Error:", ""), {
        description: formatDateToDateVN(new Date()),
        richColors: true,
      });
    return false;
  }
}

// Simple toast function
export function toastSimple(mess: string, type: ToastType = "info") {
  if (!mess) return;
  toast[type](mess, {
    // position: "top-center",
    description: formatDateToDateVN(new Date()),
    richColors: true,
  });
}
