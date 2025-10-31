'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form"
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../form/create-roster-form-input";
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider";
import { useMemo } from 'react';

type Props = {
  index: number;
}

export default function OffWorkerIdFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<CreateRosterFilterFormInput>();
  const workers = useCreateRosterFilterStore(state => state.workers);

  const offs = useWatch({
    control,
    name: CreateRosterFilterKey.OFFS,
  })

  const options = useMemo(() =>
    workers.filter(worker =>
      !offs.some((off, offIndex) => (
        offIndex !== index
        && off.workerId === worker.id
      ))
    ), [workers, offs, index])

  return (
    <FormField
      control={control}
      name={`${CreateRosterFilterKey.OFFS}.${index}.${CreateRosterFilterKey.WORKER_ID}`}
      render={({ field }) => (
        <CustomFormItem>
          <ComboBox
            value={field.value}
            options={options}
            getValue={option => option.id}
            getDisplayName={option => option.name}
            onValueChange={value => {
              field.onChange(value);
              field.onBlur();
            }}
            isFormField
            isOptional={false}
          />
        </CustomFormItem>
      )}
    />
  )
}