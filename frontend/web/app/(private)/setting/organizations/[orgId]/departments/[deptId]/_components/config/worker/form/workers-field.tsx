'use client'

import { CreateUpdateWorkerConstraintFormInput } from "@/libs/worker-constraint/models/worker-constraint-form-input";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from '@/components/_general/form/custom-form-item';
import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { Worker } from "@/external/prisma-generated";

type Props = {
  workers: Worker[];
}

export default function WorkersField({
  workers,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateUpdateWorkerConstraintFormInput>();

  return (
    <FormField
      control={control}
      name='workers'
      render={({ field }) => (
        <CustomFormItem label='人員'>
          <MultiSelectCombobox
            values={field.value.map(worker => worker.id)}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={values => setValue('workers', values.map(value => ({ id: value })))}
            badgeVariant="inverted"
          />
        </CustomFormItem>
      )}
    />
  )
}