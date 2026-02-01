import { ETweetAudience } from "~/shared/enums/common.enum";
import type { ETweetStatus } from "~/shared/enums/status.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import type { IBase } from "./base.interface";
import type { IMedia } from "./media.interface";

export interface ICodesTweet {
  _id: string;
  code: string;
  langKey: string;
}

export interface ITweet extends IBase {
  user_id: string;
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | string; // null khi là tweet gốc
  hashtags: string[];
  mentions: string[]; // nhắc đến
  medias: IMedia[] | null;
  status: ETweetStatus;
  guest_view: number;
  user_view: number;
  textColor: string; // màu chữ
  bgColor: string; // màu nềns
  codes: ICodesTweet[] | null; // mã code nếu có

  //
  community_id: null | string;

  //
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  retweets_count?: number;
  quotes_count?: number;
  is_like?: boolean;
  is_bookmark?: boolean;
  retweet?: string; // id retWeet của tôi
  quote?: string; // // id quoteTweet của tôi
  total_views?: number;
}
