'use client'

import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { CreateOrganizationFormInput } from "@/libs/client/organization/models/create-organization-form-input";
import CustomInput from '@/components/_general/input/custom-input';

type Props = {
  index: number;
}

export default function WorkerNameFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<CreateOrganizationFormInput>();

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