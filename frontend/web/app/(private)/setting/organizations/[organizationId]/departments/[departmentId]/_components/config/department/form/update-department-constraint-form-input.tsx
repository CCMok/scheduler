import { MessageContent } from "@/libs/_general/enums/message";
import { z } from "zod";

export enum UpdateDepartmentConstraintFormInputKey {
  MAX_WORKER_POST_PER_ROSTER = 'maxWorkerPostPerRoster',
}

export const updateDepartmentConstraintFormInputSchema = z.object({
  [UpdateDepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER]: z.number().min(
    0,
    MessageContent.MIN.replaceAll("{0}", "0")
  ).nullish(),
})

export type UpdateDepartmentConstraintFormInput = z.infer<typeof updateDepartmentConstraintFormInputSchema>;