import { z } from "zod";

export const sendMessageDtoSchema = z.object({
  conversation: z.string().min(1, "conversationId is required"),
  sender: z.string().min(1, "conversationId is required"),
  content: z.string().min(1, "text cannot be empty"),
  attachments: z.array(z.string()).optional(),
});

export type sendMessageDto = z.infer<typeof sendMessageDtoSchema>;
