'use client'

import FormItemCustom from "@/components/form/form-item-custom"
import InputCustom from "@/components/input/input-custom"
import { FormControl, FormField } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFormContext } from "react-hook-form"

export default function FormFieldDayCount() {
  const { control } = useFormContext<RosterFilterFormInput>();

  return (
    <FormField
      control={control}
      name='dayCount'
      render={({ field }) => (
        <FormItemCustom label='日期數量'>
          <FormControl>
            <InputCustom
              type='number'
              {...field}
            />
          </FormControl>
        </FormItemCustom>
      )}
    />
  )
}