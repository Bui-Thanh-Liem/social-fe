import { useCallback, useEffect, useState } from "react";
import {
  CONSTANT_MAX_SIZE_IMAGE_UPLOAD,
  CONSTANT_MAX_SIZE_VIDEO_UPLOAD,
} from "~/shared/constants";
import { toastSimple } from "~/utils/toast";

// Custom hook for medias preview and upload
export const useMediaPreview = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (file) {
        // Validate file type
        const validImageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const validVideoTypes = [
          "video/mp4",
          "video/webm",
          "video/mov",
          "video/avi",
          "video/quicktime",
        ];

        if (
          !validImageTypes.includes(file.type) &&
          !validVideoTypes.includes(file.type)
        ) {
          toastSimple(
            "Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP) và video (MP4, WebM, MOV, AVI)",
            "warning"
          );
          return;
        }

        // Validate file size (different limits for image and video)
        const maxSize = mediaType?.startsWith("video/")
          ? CONSTANT_MAX_SIZE_VIDEO_UPLOAD
          : CONSTANT_MAX_SIZE_IMAGE_UPLOAD;

        if (file.size > maxSize) {
          const type_vn = mediaType?.startsWith("video/")
            ? "Video"
            : "Hình ảnh";
          const sizeLimitText = mediaType?.startsWith("video/")
            ? "10MB"
            : "5MB";
          toastSimple(
            `${type_vn} không được vượt quá ${sizeLimitText}, ${type_vn} bạn định tải lên: ${formatFileSize(
              file.size
            )}`,
            "warning"
          );
          return;
        }

        const mediaUrl = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(mediaUrl);
        setMediaType(file.type);
        setUploadedMediaUrl(""); // Reset uploaded URL when new file selected
        setUploadProgress(0);
      } else {
        setSelectedFile(null);
        setPreviewUrl("");
        setMediaType(null);
        setUploadedMediaUrl("");
        setUploadProgress(0);
      }
    },
    [previewUrl]
  );

  const removeMedia = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setMediaType(null);
    setUploadedMediaUrl("");
    setUploadProgress(0);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    uploadedMediaUrl,
    mediaType,
    uploadProgress,
    setUploadedMediaUrl,
    setUploadProgress,
    handleFileChange,
    removeMedia,
    formatFileSize,
  };
};
