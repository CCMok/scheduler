import { MessageContent } from "@/libs/server/_general/enums/message";
import { z } from "zod";

export const offFormInputSchema = z.object({
  workerId: z.number().min(0, MessageContent.REQUIRED),
  days: z.date().array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>;

export const createRosterFilterFormInputSchema = z.object({
  organizationId: z.number().min(0, MessageContent.REQUIRED),
  departmentId: z.number().min(0, MessageContent.REQUIRED),
  days: z.date().array().min(1, MessageContent.REQUIRED),
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

export const createRosterFilterFormInputStorageSchema = z.object({
  organizationId: z.number().optional(),
  departmentId: z.number().optional(),
  days: z.string().array().optional(),
  offs: z.object({
    workerId: z.number(),
    days: z.string().array(),
  }).array().optional(),
})

export type CreateRosterFilterFormInputStorage = z.infer<typeof createRosterFilterFormInputStorageSchema>;