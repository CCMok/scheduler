import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";

export const createUserOrganizationFormInputSchema = z.object({
  organizationId: z.string().min(1, MessageContent.REQUIRED),
})

export type CreateUserOrganizationFormInput = z.infer<typeof createUserOrganizationFormInputSchema>