import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";

export const postSettingFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessageContent.REQUIRED),
  departmentId: z.string().min(1, ClientMessageContent.REQUIRED),
  postName: z.string().min(0, ClientMessageContent.REQUIRED),
})

export type PostSettingFormInput = z.infer<typeof postSettingFormInputSchema>