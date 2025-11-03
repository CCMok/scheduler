import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

const MIN_WEIGHTING = 0;

export const workerIdFormInputSchema = z.object({
  id: z.string().min(1, MessageContent.REQUIRED),
})

export const createUpdateWorkerConstraintFormInputSchema = z.object({
  workerConstraintTypeId: z.string().min(1, MessageContent.REQUIRED),
  workers: workerIdFormInputSchema.array(),
  weighting: z.number().min(MIN_WEIGHTING, MessageContent.MIN.replaceAll("{0}", MIN_WEIGHTING.toString())),
})

export type CreateUpdateWorkerConstraintFormInput = z.infer<typeof createUpdateWorkerConstraintFormInputSchema>