import type { IMedia } from "~/shared/interfaces/schemas/media.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export interface IResTodayNewsOrOutstanding {
  id: number;
  time: Date;
  media: IMedia;
  category: string;
  posts: number; // Số lượng bài đã đăng với keyword/hashtag nổi bật hôm nay
  trending: ITrending;
  relevant_ids: string[];

  highlight: (Pick<ITweet, "_id" | "content" | "created_at"> &
    Pick<IUser, "avatar" | "name" | "username" | "verify">)[];
}
