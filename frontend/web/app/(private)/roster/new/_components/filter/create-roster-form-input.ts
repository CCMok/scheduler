import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";

export const offFormInputSchema = z.object({
  workerId: z.number().min(0, UiMessageContent.REQUIRED),
  days: z.date().array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>;

export const createRosterFilterFormInputSchema = z.object({
  organizationId: z.number().min(0, UiMessageContent.REQUIRED),
  departmentId: z.number().min(0, UiMessageContent.REQUIRED),
  days: z.date().array().min(1, UiMessageContent.REQUIRED),
  offs: offFormInputSchema.array(),
})

export type CreateRosterFilterFormInput = z.infer<typeof createRosterFilterFormInputSchema>;

export enum CreateRosterFilterKey {
  ORGANIZATION_ID = 'organizationId',
  DEPARTMENT_ID = 'departmentId',
  DAYS = 'days',
  OFFS = 'offs',
  WORKER_ID = 'workerId',
}