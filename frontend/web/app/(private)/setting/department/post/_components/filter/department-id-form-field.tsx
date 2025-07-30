'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input"
import { useFormContext } from "react-hook-form"
import { usePostSettingFilterStore } from "@/components/store/setting/post/post-setting-filter-store-provider"

export default function DepartmentIdFormField() {
  const { control, setValue } = useFormContext<PostSettingFormInput>();

  const departments = usePostSettingFilterStore(state => state.departments);

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