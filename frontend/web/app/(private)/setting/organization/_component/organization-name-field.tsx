'use client'

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { Organization } from "@/external/prisma-generated";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { OrganizationSettingNameFormInput } from "@/libs/client/organization/models/organization-setting-name-form-input";
import { useFormContext, useWatch } from "react-hook-form";

type Props = {
  organizations: Organization[];
  defaultOrganizationId: string;
}

export default function OrganizationNameField({
  organizations,
  defaultOrganizationId,
}: Readonly<Props>) {
  const { control } = useFormContext<OrganizationSettingNameFormInput>();
  
  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: defaultOrganizationId,
  })

  const placeholder = organizations.find(organization => organization.id.toString() === organizationId)?.name ?? '';

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <CustomFormItem>
          <FormControl>
            <CustomInput
              {...field}
              placeholder={placeholder}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}