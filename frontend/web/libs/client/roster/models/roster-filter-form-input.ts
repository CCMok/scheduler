import { z } from "zod";
import { ClientMessage } from "../../_general/enums/client-message";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offFormInputSchema = z.object({
  workerId: z.string().min(1, ClientMessage.REQUIRED),
  days: z.string().array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const rosterFilterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessage.REQUIRED),
  departmentId: z.string().min(1, ClientMessage.REQUIRED),
  dayCount: z.coerce.number()
    .int(ClientMessage.INTEGER)
    .positive(ClientMessage.MIN.replaceAll("{0}", "1"))
    .max(MAX_DAY_COUNT, ClientMessage.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type RosterFilterFormInput = z.infer<typeof rosterFilterFormInputSchema>