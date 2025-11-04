'use client'

import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { CreateDepartmentFormInput } from "@/libs/department/models/create-department-form-input";
import CustomInput from '@/components/_general/input/custom-input';

type Props = {
  index: number;
}

export default function PostNameFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<CreateDepartmentFormInput>();

  return (
    <FormField
      control={control}
      name={`posts.${index}.name`}
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