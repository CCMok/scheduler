import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offFormInputSchema = z.object({
  workerId: z.string().min(1, ClientMessageContent.REQUIRED),
  days: z.string().array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const arrangeRosterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessageContent.REQUIRED),
  departmentId: z.string().min(1, ClientMessageContent.REQUIRED),
  days: z.date().array()
    .min(1, ClientMessageContent.REQUIRED)
    .max(MAX_DAY_COUNT, ClientMessageContent.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type ArrangeRosterFormInput = z.infer<typeof arrangeRosterFormInputSchema>