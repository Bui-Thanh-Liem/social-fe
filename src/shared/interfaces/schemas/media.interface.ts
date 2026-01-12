import type { MediaItem } from "~/hooks/useMediaPreviewMulti";
import type { EMediaStatus } from "~/shared/enums/status.enum";

export interface IMedia {
  file_size: number;
  file_type: string;
  file_name: string;

  url?: string | undefined;
  s3_key: string;

  user_id?: string;
  status: EMediaStatus;
}

export interface PreviewMediaProps {
  mediaItems: MediaItem[];
  removeMedia: (id: string) => void;
}
