'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { useArrangeRosterFilterStore } from "../store/arrange-roster-filter-store-provider";

type Props = {
  index: number;
}

export default function OffDaysFormField({
  index
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<ArrangeRosterFormInput>();

  const offDays = useArrangeRosterFilterStore(state => state.offDays);

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem>
          <MultiSelectCombobox
            values={field.value}
            options={offDays}
            getValue={option => option.value}
            getDisplayName={option => option.name}
            onValueChange={value => setValue(`offs.${index}.days`, value)}
            badgeVariant="inverted"
          />
        </CustomFormItem>
      )}
    />
  )
}