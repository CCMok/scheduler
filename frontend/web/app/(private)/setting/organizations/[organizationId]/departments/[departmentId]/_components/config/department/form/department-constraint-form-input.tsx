import { MessageContent } from "@/libs/_general/enums/message";
import { z } from "zod";

export enum DepartmentConstraintFormInputKey {
  MAX_WORKER_POST_PER_ROSTER = 'maxWorkerPostPerRoster',
}

export const departmentConstraintFormInputSchema = z.object({
  [DepartmentConstraintFormInputKey.MAX_WORKER_POST_PER_ROSTER]: z.number().min(
    0,
    MessageContent.MIN.replaceAll("{0}", "0")
  ).nullish(),
})

export type DepartmentConstraintFormInput = z.infer<typeof departmentConstraintFormInputSchema>;