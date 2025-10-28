'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";
import { useCreateRosterFilterStore } from '@/app/(private)/roster/new/_components/filter/store/create-roster-filter-store-provider';

type Props = {
  index: number;
}

export default function WorkerIdFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<CreateRosterFilterFormInput>();
  const workers = useCreateRosterFilterStore(state => state.workers);

  return (
    <FormField
      control={control}
      name={`${CreateRosterFilterKey.OFFS}.${index}.${CreateRosterFilterKey.WORKER_ID}`}
      render={({ field }) => (
        <CustomFormItem>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id}
            getDisplayName={option => option.name}
            onValueChange={value => field.onChange(value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}