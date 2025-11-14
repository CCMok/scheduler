import { MessageContent } from "@/libs/_general/enums/message";
import { z } from "zod";

export enum UpdateUserNameFormKey {
  NAME = 'name',
}

export const updateUserNameFormInputSchema = z.object({
  [UpdateUserNameFormKey.NAME]: z.string().min(0, MessageContent.REQUIRED),
})

export type UpdateUserNameFormInput = z.infer<typeof updateUserNameFormInputSchema>