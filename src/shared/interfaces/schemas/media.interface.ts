import type { MediaItem } from "~/hooks/useMediaPreviewMulti";
import { EMediaStatus } from "~/shared/enums/status.enum";

export interface IMedia {
  file_type: string;
  file_size: number;
  file_name?: string;

  url?: string | undefined;
  s3_key: string;

  user_id?: string;
  status: EMediaStatus;
}

export type IMediaBare = Pick<IMedia, "s3_key" | "url">;

export interface PreviewMediaProps {
  mediaItems: MediaItem[];
  removeMedia: (id: string) => void;
}
