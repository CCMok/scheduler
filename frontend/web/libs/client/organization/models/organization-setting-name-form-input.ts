import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";

export const organizationNameSettingFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessageContent.REQUIRED),
  name: z.string().min(1, ClientMessageContent.REQUIRED),
})

export type OrganizationNameSettingFormInput = z.infer<typeof organizationNameSettingFormInputSchema>