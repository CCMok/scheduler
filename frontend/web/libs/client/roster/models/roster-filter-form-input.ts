import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offFormInputSchema = z.object({
  workerId: z.string().min(1, UiMessageContent.REQUIRED),
  days: z.string().array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const arrangeRosterFormInputSchema = z.object({
  organizationId: z.string().min(1, UiMessageContent.REQUIRED),
  departmentId: z.string().min(1, UiMessageContent.REQUIRED),
  days: z.date().array()
    .min(1, UiMessageContent.REQUIRED)
    .max(MAX_DAY_COUNT, UiMessageContent.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type ArrangeRosterFormInput = z.infer<typeof arrangeRosterFormInputSchema>

export const offFormInputStorageSchema = z.object({
  workerId: z.string(),
  days: z.string().array(),
})

export const arrangeRosterFormInputStorageSchema = z.object({
  organizationId: z.string(),
  departmentId: z.string(),
  days: z.date().array(),
  offs: offFormInputStorageSchema.array(),
})