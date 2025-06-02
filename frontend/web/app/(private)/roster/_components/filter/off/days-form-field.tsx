'use client'

import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form"
import MultiSelectCombobox from "@/components/combobox/multi/multi-select-combobox";
import { DEFAULT_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";
import { OffDay } from "@/libs/client/roster/models/off-day";
import { useEffect, useMemo } from "react";

type Props = {
  index: number;
}

export default function DaysFormField({
  index
}: Readonly<Props>) {
  const { control, getValues, setValue } = useFormContext<RosterFilterFormInput>();

  const dayCount = useWatch({
    control,
    name: 'dayCount',
    defaultValue: 0,
  })

  const days = useMemo(() => {
    const dayCountNumber = typeof dayCount === 'string' ? Number(dayCount) : dayCount;
    if (isNaN(dayCountNumber)) return [];

    const days: OffDay[] = [];
    for (let i = 0; i < dayCountNumber; i++) {
      days.push({ value: i.toString(), name: i.toString() })
    }

    return days;
  }, [dayCount])

  useEffect(() => {
    const selectedDays = getValues(`offs.${index}.days`)

    const validSelectedDays = selectedDays.filter(selectedDay =>
      days.some(day => day.value === selectedDay)
    )

    setValue(`offs.${index}.days`, validSelectedDays)
  }, [days, index, getValues, setValue])

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem label='缺席日'>
          <MultiSelectCombobox
            values={field.value}
            options={days}
            getValue={option => option.value}
            getDisplayName={option => option.name}
            onValueChange={value => setValue(`offs.${index}.days`, value)}
            selectedItemVariant="inverted"
            animation={2}
            maxDisplayCount={DEFAULT_DAY_COUNT}
          />
        </CustomFormItem>
      )}
    />
  )
}