import type { EInvitationStatus } from "~/shared/enums/status.enum";
import type {
  EActivityType,
  EMembershipType,
  EVisibilityType,
} from "~/shared/enums/type.enum";
import { type IBase } from "./base.interface";
import type { IUser } from "./user.interface";
import type { IMediaBare } from "../common/media-bare.interface";

export interface ICommunity extends IBase {
  name: string;
  slug: string;
  desc: string;
  cover: IMediaBare;
  bio: string;
  admin: string;
  category: string;
  verify: boolean;

  //
  visibility_type: EVisibilityType; // hiển thị nội dung cho người xem là thành viên hay mọi người
  membership_type: EMembershipType; // Nhóm chỉ được mời mới được tham gia hay là mở để mọi người có thể tham gia
  show_log_for_member: boolean;
  show_log_for_mentor: boolean;
  show_invite_list_for_member: boolean;
  show_invite_list_for_mentor: boolean;
  invite_expire_days: number; // Lời mời có hiệu lực trong

  pinned?: boolean;
  is_joined?: boolean;
  is_admin?: boolean;
  is_member?: boolean;
  is_mentor?: boolean;
  member_count?: number;

  members?: IUser[];
  mentors?: IUser[];
}

export interface ICommunityInvitation extends IBase {
  exp: Date;
  user_id: string | IUser;
  inviter: string;
  community_id: string;
  status: EInvitationStatus;
}

export interface IActionActivity {
  message: string;
  key: EActivityType;
}

export interface ICommunityActivity extends IBase {
  actor_id: string; // người thực hiện hành động
  community_id: string; // cộng đồng bị tác động
  action: IActionActivity; // ví dụ: "join", "leave", "post_created", ...
  target_id?: string; // nếu có đối tượng cụ thể (bài viết, bình luận, v.v.)
}
