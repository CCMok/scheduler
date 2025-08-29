'use client'

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { UpdateOrganizationNameFormInput } from "@/libs/client/organization/models/update-organization-name-form-input";
import { useFormContext } from "react-hook-form";

export default function OrganizationNameField() {
  const { control } = useFormContext<UpdateOrganizationNameFormInput>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <CustomFormItem>
          <FormControl>
            <CustomInput
              {...field}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}