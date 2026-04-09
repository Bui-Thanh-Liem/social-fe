import type { EReelType } from "~/shared/enums/type.enum";
import type { IBase } from "./base.interface";
import type { IMedia } from "./media.interface";
import type { IUser } from "./user.interface";
import type { EReelStatus } from "~/shared/enums/status.enum";

export interface IReel extends IBase {
  video: IMedia;
  content?: string;
  hashtags?: string[];
  mentions?: string[];
  isPinAvatar?: boolean; // có ghim avatar lên video không
  user: IUser;
  type: EReelType;
  status: EReelStatus;
}
