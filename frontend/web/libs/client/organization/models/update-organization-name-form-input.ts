import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updateOrganizationNameFormInputSchema = z.object({
  organizationId: z.string().min(1, UiMessageContent.REQUIRED),
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdateOrganizationNameFormInput = z.infer<typeof updateOrganizationNameFormInputSchema>