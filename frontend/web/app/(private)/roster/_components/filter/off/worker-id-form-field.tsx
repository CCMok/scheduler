'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import ComboBox from "@/components/combobox/combobox";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { useRosterStore } from "@/components/store/roster/roster-store-provider";

type Props = {
  index: number;
}

export default function WorkerIdFormField({
  index
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<ArrangeRosterFormInput>();

  const { workers } = useRosterStore(state => state)

  return (
    <FormField
      control={control}
      name={`offs.${index}.workerId`}
      render={({ field }) => (
        <CustomFormItem label='人員'>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue(`offs.${index}.workerId`, value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}