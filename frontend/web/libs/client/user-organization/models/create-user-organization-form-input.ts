import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createUserOrganizationFormInputSchema = z.object({
  organizationId: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreateUserOrganizationFormInput = z.infer<typeof createUserOrganizationFormInputSchema>