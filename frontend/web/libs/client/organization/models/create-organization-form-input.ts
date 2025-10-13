import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";
import { relatedFormInputSchema } from "../../department/models/create-department-form-input";

export const createOrganizationFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
  departmentName: z.string().min(1, UiMessageContent.REQUIRED),
}).merge(relatedFormInputSchema)

export type CreateOrganizationFormInput = z.infer<typeof createOrganizationFormInputSchema>