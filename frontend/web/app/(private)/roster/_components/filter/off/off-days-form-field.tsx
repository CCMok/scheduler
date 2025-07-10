'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form"
import MultiSelectCombobox from "@/components/combobox/multi/multi-select-combobox";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";

type Props = {
  index: number;
}

export default function OffDaysFormField({
  index
}: Readonly<Props>) {
  const { control, getValues, setValue } = useFormContext<ArrangeRosterFormInput>();

  const days = useWatch({
    control,
    name: 'days',
    defaultValue: [],
  })

  const options = useMemo(() => days
    .toSorted((a, b) => a.getTime() - b.getTime())
    .map(day => ({
      value: day.toISOString(),
      displayName: format(day, 'yyyy-MM-dd'),
    })), [days])

  useEffect(() => {
    const selectedDays = getValues(`offs.${index}.days`)

    const validSelectedDays = selectedDays.filter(selectedDay =>
      options.some(option => option.value === selectedDay)
    )

    setValue(`offs.${index}.days`, validSelectedDays)
  }, [options, index, getValues, setValue])

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem label='缺席日'>
          <MultiSelectCombobox
            values={field.value}
            options={options}
            getValue={option => option.value}
            getDisplayName={option => option.displayName}
            onValueChange={value => setValue(`offs.${index}.days`, value)}
            badgeVariant="inverted"
            maxDisplayCount={4}
          />
        </CustomFormItem>
      )}
    />
  )
}