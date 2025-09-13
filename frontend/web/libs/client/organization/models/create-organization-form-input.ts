import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createOrganizationFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreateOrganizationFormInput = z.infer<typeof createOrganizationFormInputSchema>