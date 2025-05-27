import { z } from "zod";
import { ClientMessage } from "../../_general/enums/client-message";

export const rosterFilterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessage.REQUIRED),
  departmentId: z.string().min(1, ClientMessage.REQUIRED),
})

export type RosterFilterFormInput = z.infer<typeof rosterFilterFormInputSchema>