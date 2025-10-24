'use client'

import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form"
import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../create-roster-form-input";
import { compareAsc, format } from 'date-fns';

type Props = {
  index: number;
}

export default function OffDaysField({
  index
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateRosterFilterFormInput>();

  const days = useWatch({
    control,
    name: CreateRosterFilterKey.DAYS,
  })

  return (
    <FormField
      control={control}
      name={`${CreateRosterFilterKey.OFFS}.${index}.${CreateRosterFilterKey.DAYS}`}
      render={({ field }) => (
        <CustomFormItem>
          <MultiSelectCombobox
            values={field.value.map(day => day.toISOString())}
            options={days.toSorted(compareAsc)}
            getValue={option => option.toISOString()}
            getDisplayName={option => format(option, 'yyyy-MM-dd')}
            onValueChange={value => setValue(`${CreateRosterFilterKey.OFFS}.${index}.${CreateRosterFilterKey.DAYS}`, value.map(day => new Date(day)))}
            badgeVariant="inverted"
          />
        </CustomFormItem>
      )}
    />
  )
}