import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createDepartmentFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreateDepartmentFormInput = z.infer<typeof createDepartmentFormInputSchema>