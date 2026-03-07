import type { IBase } from "./base.interface";
import type { ICommunity } from "./community.interface";
import type { ITweet } from "./tweet.interface";
import type { IUser } from "./user.interface";

export interface IAccessRecent extends IBase {
  ref_id: string;
  ref_slug?: string; // Dùng để lưu tên hiển thị của ref_id (như username, community name, tweet content...) để tránh phải join khi lấy danh sách truy cập gần đây
  user_id: string;
  type: "tweet" | "community" | "user";
  detail: IUser | ICommunity | ITweet;
}
