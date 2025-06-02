'use client'

import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import ComboBox from "@/components/combobox/combobox";
import CustomFormItem from "@/components/form/custom-form-item";
import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"

type Props = {
  index: number;
}

export default function WorkerIdFormField({
  index
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();

  const { workers } = useRosterFilterStore(state => state)

  return (
    <FormField
      control={control}
      name={`offs.${index}.worker_id`}
      render={({ field }) => (
        <CustomFormItem label='人員'>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue(`offs.${index}.worker_id`, value)}
          />
        </CustomFormItem>
      )}
    />
  )
}