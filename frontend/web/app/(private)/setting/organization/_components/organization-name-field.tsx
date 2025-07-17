'use client'

import { getDefaultOrganizationId } from "@/app/(private)/roster/_components/form/arrange-roster-form-utils";
import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { Organization } from "@/external/prisma-generated";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { UpdateOrganizationNameFormInput } from "@/libs/client/organization/models/update-organization-name-form-input";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

type Props = {
  organizations: Organization[];
}

export default function OrganizationNameField({
  organizations,
}: Readonly<Props>) {
  const { control, resetField } = useFormContext<UpdateOrganizationNameFormInput>();

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: getDefaultOrganizationId(organizations),
  })

  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    resetField('name')
  }, [organizationId, resetField])

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