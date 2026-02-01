import { z } from "zod";
import {
  CONSTANT_MAX_LENGTH_CONTENT,
  CONSTANT_REGEX,
} from "~/shared/constants";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import { MediaBareDtoSchema } from "./common/media-bare.dto";

// Codes DTO
export const CodesDtoSchema = z.object({
  _id: z.string().trim(),
  langKey: z.string().trim(),
  code: z.string().max(500, `Nội dung tối đa 500 kí tự`).trim(),
});

// Create Tweet DTO
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
      `Nội dung tối đa ${CONSTANT_MAX_LENGTH_CONTENT} kí tự`,
    )
    .trim(),
  hashtags: z.array(z.string().trim()).optional(), // client gửi lên name
  mentions: z
    .array(
      z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
        message: "ObjectId không hợp lệ",
      }),
    )
    .optional(),
  medias: z.array(MediaBareDtoSchema).optional(),
  textColor: z.string().trim().optional(),
  bgColor: z.string().trim().optional(),
  codes: z.array(CodesDtoSchema).optional(),
});

// Get One Tweet By Id DTO
export const GetOneTweetByIdDtoSchema = z.object({
  tweet_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "ObjectId không hợp lệ",
  }),
});

// Get Tweet Children DTO
export const getTweetChildrenDtoSchemaParams = z.object({
  tweet_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: "ObjectId không hợp lệ",
  }),
});

// Get Tweet Children Body DTO
export const getTweetChildrenDtoSchemaBody = z.object({
  tweet_type: z
    .nativeEnum(ETweetType)
    .refine((val) => Object.values(ETweetType).includes(val), {
      message: "Invalid Tweet Type",
    }),
});

// Get New Feed Type DTO
export const getNewFeedTypeDtoSchema = z.object({
  feed_type: z
    .nativeEnum(EFeedType)
    .refine((val) => Object.values(ETweetType).includes(val), {
      message: "Invalid Feed Type",
    }),
});

// Get Profile Tweet DTO
export const getProfileTweetDtoSchema = z.object({
  tweet_type: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .nativeEnum(ETweetType)
      .refine((val) => Object.values(ETweetType).includes(val), {
        message: "Invalid Tweet Type",
      }),
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
