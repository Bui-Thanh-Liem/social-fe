import z from "zod";
import { MediaBareDtoSchema } from "./common/media-bare.dto";
import {
  CONSTANT_MAX_LENGTH_CONTENT,
  CONSTANT_REGEX,
} from "~/shared/constants";
import { EReelType } from "~/shared/enums/type.enum";
import { EReelStatus } from "~/shared/enums/status.enum";

// Create Reel DTO
export const CreateReelDtoSchema = z.object({
  type: z.enum(EReelType),
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
  video: z.array(MediaBareDtoSchema).optional(),
  status: z.enum(EReelStatus),
  isPinAvatar: z.boolean().default(false).optional(),
});

export type CreateReelDto = z.infer<typeof CreateReelDtoSchema>;
