'use client'

import CustomFormItem from '@/components/_general/form/custom-form-item';
import CustomInput from '@/components/_general/input/custom-input';
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input";
import { useFormContext } from "react-hook-form";

export default function NameField() {
  const { control } = useFormContext<UpdateNameFormInput>();

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