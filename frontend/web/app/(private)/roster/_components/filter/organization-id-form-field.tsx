'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider"
import { FormField } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"

export default function OrganizationIdFormField() {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();
  
  const { organizationDepartments } = useRosterFilterStore(state => state);
  
  return (
    <FormField
      control={control}
      name='organizationId'
      render={({ field }) => (
        <CustomFormItem label='機構'>
          <ComboBox
            value={field.value}
            items={organizationDepartments}
            getValue={item => item.id.toString()}
            getDisplayName={item => item.name}
            onSelect={value => setValue('organizationId', value)}
          />
        </CustomFormItem>
      )}
    />
  )
}