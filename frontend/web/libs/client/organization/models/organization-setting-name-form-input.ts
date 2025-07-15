import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";

export const organizationSettingNameFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessageContent.REQUIRED),
  name: z.string().min(1, ClientMessageContent.REQUIRED),
})

export type OrganizationSettingNameFormInput = z.infer<typeof organizationSettingNameFormInputSchema>