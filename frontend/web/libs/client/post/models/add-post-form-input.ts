import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";

export const addPostFormInputSchema = z.object({
  postName: z.string().min(1, ClientMessageContent.REQUIRED),
})

export type AddPostFormInput = z.infer<typeof addPostFormInputSchema>