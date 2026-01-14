import { z } from "zod";
import { MediaBareDtoSchema } from "../common/media-bare.dto";

export const sendMessageDtoSchema = z.object({
  conversation: z.string().min(1, "Bắt buộc phải có id cuộc trò chuyện"),
  sender: z.string().min(1, "Người gửi là bắt buộc"),
  content: z.string().optional(),
  attachments: z.array(MediaBareDtoSchema).optional(),
});

export type sendMessageDto = z.infer<typeof sendMessageDtoSchema>;
