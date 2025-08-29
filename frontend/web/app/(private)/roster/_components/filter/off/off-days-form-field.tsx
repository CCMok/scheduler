'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import MultiSelectCombobox from "@/components/combobox/multi/multi-select-combobox";
import { useEffect } from "react";
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider";

type Props = {
  index: number;
}

export default function OffDaysFormField({
  index
}: Readonly<Props>) {
  const { control, getValues, setValue } = useFormContext<ArrangeRosterFormInput>();

  const offDays = useArrangeRosterFilterStore(state => state.offDays);

  useEffect(() => {
    const selectedDays = getValues(`offs.${index}.days`)

    const validSelectedDays = selectedDays.filter(selectedDay =>
      offDays.some(offDay => offDay.value === selectedDay)
    )

    setValue(`offs.${index}.days`, validSelectedDays)
  }, [offDays, index, getValues, setValue])

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem label='缺席日'>
          <MultiSelectCombobox
            values={field.value}
            options={offDays}
            getValue={option => option.value}
            getDisplayName={option => option.name}
            onValueChange={value => setValue(`offs.${index}.days`, value)}
            badgeVariant="inverted"
            maxDisplayCount={4}
          />
        </CustomFormItem>
      )}
    />
  )
}