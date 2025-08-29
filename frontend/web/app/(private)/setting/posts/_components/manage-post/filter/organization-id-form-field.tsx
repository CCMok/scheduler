'use client'

import ComboBox from "@/components/combobox/combo-box"
import CustomFormItem from "@/components/form/custom-form-item"
import { usePostSettingFilterStore } from "@/app/(private)/setting/posts/_components/manage-post/filter/store/post-setting-filter-store-provider"
import { FormField } from "@/external/shadcn/components/ui/form"
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input"
import { useFormContext } from "react-hook-form"

export default function OrganizationIdFormField() {
  const { control, setValue } = useFormContext<PostSettingFormInput>();
  
  const organizations = usePostSettingFilterStore(state => state.organizations);
  
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