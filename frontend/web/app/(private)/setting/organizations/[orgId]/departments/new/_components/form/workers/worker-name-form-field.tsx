'use client'

import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import CustomInput from '@/components/_general/input/custom-input';
import { CreateDepartmentFormInput } from '@/libs/client/department/models/create-department-form-input';

type Props = {
  index: number;
}

export default function WorkerNameFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<CreateDepartmentFormInput>();

  return (
    <FormField
      control={control}
      name={`workers.${index}.name`}
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