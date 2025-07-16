import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { OrganizationSettingNameFormInput } from "@/libs/client/organization/models/organization-setting-name-form-input";

export const updateOrganizationNameRequestSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
})

export type UpdateOrganizationNameRequest = z.infer<typeof updateOrganizationNameRequestSchema>;

export const getUpdateOrganizationNameRequest = (formInput: OrganizationSettingNameFormInput): UpdateOrganizationNameRequest => ({
  id: Number(formInput.organizationId),
  name: formInput.name,
})