'use client'

import ComboBox from '@/components/_general/combobox/combo-box'
import CustomFormItem from '@/components/_general/form/custom-form-item'
import { FormField } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider"

export default function DepartmentIdFormField() {
  const { control, setValue } = useFormContext<ArrangeRosterFormInput>();

  const departments = useArrangeRosterFilterStore(state => state.departments);

  return (
    <FormField
      control={control}
      name='departmentId'
      render={({ field }) => (
        <CustomFormItem label='部門'>
          <ComboBox
            value={field.value}
            options={departments}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('departmentId', value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}