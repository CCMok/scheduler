'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { useRosterStore } from "@/components/store/roster/roster-store-provider"
import { FormField } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"

export default function OrganizationIdFormField() {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();
  
  const { organizations } = useRosterStore(state => state);
  
  return (
    <FormField
      control={control}
      name='organizationId'
      render={({ field }) => (
        <CustomFormItem label='機構'>
          <ComboBox
            value={field.value}
            options={organizations}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('organizationId', value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}