'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext, useWatch } from "react-hook-form"
import { getDefaultOrganizationId, getDepartments } from "../roster-filter-form-utils"
import { useEffect, useMemo } from "react"
import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider"

export default function DepartmentIdFormField() {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();

  const { organizations } = useRosterFilterStore(state => state);

  const defaultOrganizationId = useMemo(() => getDefaultOrganizationId(organizations), [organizations])

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: defaultOrganizationId,
  })

  const departments = useMemo(
    () => getDepartments(organizations, organizationId),
    [organizations, organizationId]
  )

  useEffect(() => {
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
            items={departments}
            getValue={item => item.id.toString()}
            getDisplayName={item => item.name}
            onSelect={value => setValue('departmentId', value)}
          />
        </CustomFormItem>
      )}
    />
  )
}