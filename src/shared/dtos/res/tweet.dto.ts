import type { EFeedTypeItem } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export type ResCreateTweet = {
  acknowledged: boolean;
  insertedId: string;
};

export type ResNewFeeds = {
  type: EFeedTypeItem;
  items: ITweet[] | ICommunity[];
};

export interface ResCountViewLinkBookmarkInWeek {
  tweet_views_count: {
    data: {
      name: string; // T2, T3, ...
      tt: number; // Tuần trước
      tn: number; // Tuần này
    }[];
    total_views: number;
  };
  tweet_likes_count: {
    data: {
      name: string; // T2, T3, ...
      tt: number; // Tuần trước
      tn: number; // Tuần này
    }[];
    total_views: number;
  };
  tweet_bookmarks_count: {
    data: {
      name: string; // T2, T3, ...
      tt: number; // Tuần trước
      tn: number; // Tuần này
    }[];
    total_views: number;
  };
}
