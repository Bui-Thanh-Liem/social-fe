import { useMutation } from "@tanstack/react-query";
import { OkResponse } from "~/shared/classes/response.class";
import {
  CONSTANT_MAX_SIZE_IMAGE_UPLOAD,
  CONSTANT_MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import type {
  DeleteMediaDto,
  PresignedUrlDto,
  UploadConfirmDto,
} from "~/shared/dtos/req/upload.dto";
import type { ResPresignedUrl } from "~/shared/dtos/res/upload.dto";
import type { IMedia } from "~/shared/interfaces/schemas/media.interface";
import { apiCall } from "~/utils/callApi.util";
import { toastSimple } from "~/utils/toast";

const uploadEndpoint = "/uploads/";

export const allowedImgTypes = ["image/jpeg", "image/jpg", "image/png"];

export const allowedVideoTypes = [
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/avi",
];

// 📸 POST - Get presigned URLs for uploading files
export const usePresignedUrl = () => {
  return useMutation({
    mutationFn: async (
      files: File[]
    ): Promise<OkResponse<ResPresignedUrl[]>> => {
      // Tạo payload từ file list
      const payload: PresignedUrlDto[] = files.map((file) => ({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      }));

      // Gọi API lấy presigned URL
      const results = await Promise.all(
        payload.map(async (item) => {
          const res = await apiCall<ResPresignedUrl>(
            `${uploadEndpoint}presigned-url`,
            {
              method: "POST",
              body: JSON.stringify(item),
            }
          );
          return res.metadata!;
        })
      );
      return new OkResponse("Success", results);
    },

    onSuccess: () => {
      console.log("Lấy presigned URL thành công!");
    },
  });
};

// 🔍 Validate file trước khi upload
export const validateMediaFile = (file: File) => {
  if (allowedImgTypes.includes(file.type)) {
    if (file.size > CONSTANT_MAX_SIZE_IMAGE_UPLOAD) {
      throw new Error("Dung lượng ảnh quá lớn. Tối đa 5MB.");
    }
    return true;
  }

  if (allowedVideoTypes.includes(file.type)) {
    if (file.size > CONSTANT_MAX_SIZE_VIDEO_UPLOAD) {
      throw new Error("Dung lượng video quá lớn. Tối đa 10MB.");
    }
    return true;
  }

  throw new Error("Định dạng không được hỗ trợ.");
};

// 🎯 Hook tiện ích để upload với validation
export const useUploadMedia = () => {
  const presignedUrlMutation = usePresignedUrl();

  return useMutation({
    mutationFn: async (files: File[]) => {
      // 1. Validate files
      files.forEach((file) => validateMediaFile(file));

      // 2. Lấy danh sách Presigned URLs từ Server của bạn
      const res = await presignedUrlMutation.mutateAsync(files);
      const presignedData = res.metadata || []; // ResPresignedUrl[]

      // 3. Thực hiện Upload từng file lên S3
      const keys = await Promise.all(
        files.map(async (file, index) => {
          const { presigned_url, key } = presignedData[index];

          const uploadResponse = await fetch(presigned_url, {
            method: "PUT", // Bắt buộc là PUT cho S3 Presigned URL
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadResponse.ok) {
            toastSimple("Tải hình ảnh / video lên thất bại!", "error");
          }

          return key;
        })
      );

      // 4. Gọi API confirm với danh sách keys đã upload thành công
      const resConfirm = await apiCall<IMedia[]>(`${uploadEndpoint}confirm`, {
        method: "POST",
        body: JSON.stringify({ s3_keys: keys } as UploadConfirmDto),
      });

      // 5. Trả về kết quả
      return resConfirm;
    },
    onSuccess: (data) => {
      console.log("Tải lên tất cả file lên S3 thành công:", data);
    },
    onError: (error: any) => {
      console.error("Tải lên thất bại:", error.message);
    },
  });
};

// 🎯 Hook để xóa nhiều ảnh/ video từ medias
export const useDeleteMedia = () => {
  return useMutation({
    mutationFn: async (body: DeleteMediaDto) =>
      apiCall(uploadEndpoint, {
        method: "DELETE",
        body: JSON.stringify(body),
      }),
  });
};
