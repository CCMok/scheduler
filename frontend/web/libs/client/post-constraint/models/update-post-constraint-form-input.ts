import { z } from "zod";
import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";

const MIN_WEIGHTING = 0;

export const updatePostConstraintFormInputSchema = z.object({
  postConstraintTypeId: z.string().min(1, UiMessageContent.REQUIRED),
  weighting: z.number().min(MIN_WEIGHTING, UiMessageContent.MIN.replaceAll("{0}", MIN_WEIGHTING.toString())),
  postIds: z.string().min(1, UiMessageContent.REQUIRED).array(),
})

export type UpdatePostConstraintFormInput = z.infer<typeof updatePostConstraintFormInputSchema>