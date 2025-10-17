'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { useArrangeRosterFilterStore } from "../store/arrange-roster-filter-store-provider";

type Props = {
  index: number;
}

export default function WorkerIdFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<ArrangeRosterFormInput>();
  const workers = useArrangeRosterFilterStore(state => state.workers);

  return (
    <FormField
      control={control}
      name={`offs.${index}.workerId`}
      render={({ field }) => (
        <CustomFormItem>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => field.onChange(value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}