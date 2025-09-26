import { z } from "zod";
import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";

const MIN_WEIGHTING = 0;

export const postIdFormInputSchema = z.object({
  id: z.string().min(1, UiMessageContent.REQUIRED),
})

export const createUpdatePostConstraintFormInputSchema = z.object({
  postConstraintTypeId: z.string().min(1, UiMessageContent.REQUIRED),
  posts: postIdFormInputSchema.array(),
  weighting: z.number().min(MIN_WEIGHTING, UiMessageContent.MIN.replaceAll("{0}", MIN_WEIGHTING.toString())),
})

export type CreateUpdatePostConstraintFormInput = z.infer<typeof createUpdatePostConstraintFormInputSchema>