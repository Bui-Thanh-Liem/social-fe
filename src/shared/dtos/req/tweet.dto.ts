import { z } from "zod";
import {
  CONSTANT_MAX_LENGTH_CONTENT,
  CONSTANT_REGEX,
} from "~/shared/constants";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import { MediaBareDtoSchema } from "./common/media-bare.dto";

export const CreateTweetDtoSchema = z.object({
  type: z.nativeEnum(ETweetType),
  audience: z.nativeEnum(ETweetAudience),
  parent_id: z
    .string()
    .trim()
    .regex(CONSTANT_REGEX.ID_MONGO, {
      message: "ObjectId không hợp lệ",
    })
    .optional(),
  community_id: z
    .string()
    .trim()
    .regex(CONSTANT_REGEX.ID_MONGO, {
      message: "ObjectId không hợp lệ",
    })
    .optional(),
  content: z
    .string()
    .max(
      CONSTANT_MAX_LENGTH_CONTENT,
      `Nội dung tối đa ${CONSTANT_MAX_LENGTH_CONTENT} kí tự`
    )
    .trim(),
  hashtags: z.array(z.string().trim()).optional(), // client gửi lên name
  mentions: z
    .array(
      z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
        message: "ObjectId không hợp lệ",
      })
    )
    .optional(),
  medias: z.array(MediaBareDtoSchema).optional(),
});

export const GetOneTweetByIdDtoSchema = z.object({
  tweet_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "ObjectId không hợp lệ",
  }),
});

export const getTweetChildrenDtoSchemaParams = z.object({
  tweet_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "ObjectId không hợp lệ",
  }),
});

export const getTweetChildrenDtoSchemaBody = z.object({
  tweet_type: z
    .nativeEnum(ETweetType)
    .refine((val) => Object.values(ETweetType).includes(val), {
      message: "Invalid Tweet Type",
    }),
});

export const getNewFeedTypeDtoSchema = z.object({
  feed_type: z
    .nativeEnum(EFeedType)
    .refine((val) => Object.values(ETweetType).includes(val), {
      message: "Invalid Feed Type",
    }),
});

export const getProfileTweetDtoSchema = z.object({
  tweet_type: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .nativeEnum(ETweetType)
      .refine((val) => Object.values(ETweetType).includes(val), {
        message: "Invalid Tweet Type",
      })
  ),
});

export type GetOneTweetByIdDto = z.infer<typeof GetOneTweetByIdDtoSchema>;
export type CreateTweetDto = z.infer<typeof CreateTweetDtoSchema>;
export type getTweetChildrenDtoParams = z.infer<
  typeof getTweetChildrenDtoSchemaParams
>;
export type getTweetChildrenDtoBody = z.infer<
  typeof getTweetChildrenDtoSchemaBody
>;
export type getNewFeedTypeDto = z.infer<typeof getNewFeedTypeDtoSchema>;
export type getProfileTweetDto = z.infer<typeof getProfileTweetDtoSchema>;
