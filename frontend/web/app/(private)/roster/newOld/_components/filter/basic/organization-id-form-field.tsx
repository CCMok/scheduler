'use client'

import ComboBox from '@/components/_general/combobox/combo-box'
import CustomFormItem from '@/components/_general/form/custom-form-item'
import { FormField } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"
import { useArrangeRosterFilterStore } from '../store/arrange-roster-filter-store-provider'

export default function OrganizationIdFormField() {
  const { control, setValue } = useFormContext<ArrangeRosterFormInput>();
  
  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  
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
            onValueChange={value => setValue('organizationId', value || '')}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}