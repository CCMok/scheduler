import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

const MIN_WEIGHTING = 0;

export const postIdFormInputSchema = z.object({
  id: z.string().min(1, MessageContent.REQUIRED),
})

export const createUpdatePostConstraintFormInputSchema = z.object({
  postConstraintTypeId: z.string().min(1, MessageContent.REQUIRED),
  posts: postIdFormInputSchema.array(),
  weighting: z.number().min(MIN_WEIGHTING, MessageContent.MIN.replaceAll("{0}", MIN_WEIGHTING.toString())),
})

export type CreateUpdatePostConstraintFormInput = z.infer<typeof createUpdatePostConstraintFormInputSchema>