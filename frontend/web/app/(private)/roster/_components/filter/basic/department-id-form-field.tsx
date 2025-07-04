'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext, useWatch } from "react-hook-form"
import { useEffect, useMemo } from "react"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"

export default function DepartmentIdFormField() {
  const { control, setValue } = useFormContext<ArrangeRosterFormInput>();

  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  const setDepartments = useArrangeRosterFilterStore(state => state.setDepartments);

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: '',
  })

  const departments = useMemo(() => {
    const organizationDepartment = organizations.find(organization => organization.id.toString() === organizationId)
    return organizationDepartment ? organizationDepartment.departments : [];
  }, [organizations, organizationId])

  useEffect(() => {
    setDepartments(departments)
    
    const departmentId = departments.length ? departments[0].id.toString() : ''
    setValue('departmentId', departmentId)
  }, [departments, setValue])

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