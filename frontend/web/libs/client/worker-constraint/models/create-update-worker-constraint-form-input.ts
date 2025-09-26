import { z } from "zod";
import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";

const MIN_WEIGHTING = 0;

export const workerIdFormInputSchema = z.object({
  id: z.string().min(1, UiMessageContent.REQUIRED),
})

export const createUpdateWorkerConstraintFormInputSchema = z.object({
  workerConstraintTypeId: z.string().min(1, UiMessageContent.REQUIRED),
  workers: workerIdFormInputSchema.array(),
  weighting: z.number().min(MIN_WEIGHTING, UiMessageContent.MIN.replaceAll("{0}", MIN_WEIGHTING.toString())),
})

export type CreateUpdateWorkerConstraintFormInput = z.infer<typeof createUpdateWorkerConstraintFormInputSchema>