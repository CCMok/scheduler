'use client'

import CustomFormItem from "@/components/form/custom-form-item"
import CustomInput from "@/components/input/custom-input"
import { FormControl, FormField } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"

export default function DayCountFormField() {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  return (
    <FormField
      control={control}
      name='dayCount'
      render={({ field }) => (
        <CustomFormItem label='日期數量'>
          <FormControl>
            <CustomInput
              type='number'
              {...field}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}