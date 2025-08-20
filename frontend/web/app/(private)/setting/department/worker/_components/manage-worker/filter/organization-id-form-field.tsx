'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { useWorkerSettingFilterStore } from "@/components/store/setting/worker/worker-setting-filter-store-provider"
import { FormField } from "@/external/shadcn/components/ui/form"
import { WorkerSettingFormInput } from "@/libs/client/worker/models/worker-setting-form-input"
import { useFormContext } from "react-hook-form"

export default function OrganizationIdFormField() {
  const { control, setValue } = useFormContext<WorkerSettingFormInput>();
  
  const organizations = useWorkerSettingFilterStore(state => state.organizations);
  
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