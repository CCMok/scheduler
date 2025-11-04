import { z } from "zod";
import { relatedFormInputSchema } from "../../../../../../../libs/department/models/create-department-form-input";
import { MessageContent } from "@/libs/_general/enums/message";

export const createOrganizationFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
  departmentName: z.string().min(1, MessageContent.REQUIRED),
}).merge(relatedFormInputSchema)

export type CreateOrganizationFormInput = z.infer<typeof createOrganizationFormInputSchema>