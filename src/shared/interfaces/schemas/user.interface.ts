import {
  EAuthVerifyStatus,
  EUserStatus,
  EUserType,
} from "~/shared/enums/status.enum";
import type { IBase } from "./base.interface";
import type { IMediaBare } from "./media.interface";

export interface IUserStatus {
  status: EUserStatus;
  reason: string;
}

export interface IUser extends IBase {
  name: string;
  email: string;
  password: string;
  day_of_birth: Date;
  status: IUserStatus;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify: EAuthVerifyStatus;
  type: EUserType;
  follower_count: number;
  following_count: number;

  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: IMediaBare;
  cover_photo?: IMediaBare;
  star?: number; // thể hiện độ uy tín
  isPinnedReel?: boolean; // có ghim reel lên avatar không

  isFollow?: boolean; // người đang active và user đang truy vấn
}
