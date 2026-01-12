import type { MediaItem } from "~/hooks/useMediaPreviewMulti";
import type { EMediaStatus } from "~/shared/enums/status.enum";

export interface IMedia {
  size: number;
  type: string;
  url?: string | undefined;
  s3_key: string;
  file_name: string;
  user_id?: string;
  status: EMediaStatus;
}

export interface PreviewMediaProps {
  mediaItems: MediaItem[];
  removeMedia: (id: string) => void;
}
