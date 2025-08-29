'use client'

import ComboBox from "@/components/combobox/combobox"
import CustomFormItem from "@/components/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { WorkerSettingFormInput } from "@/libs/client/worker/models/worker-setting-form-input"
import { useFormContext } from "react-hook-form"
import { useWorkerSettingFilterStore } from "@/app/(private)/setting/workers/_components/manage-worker/filter/store/worker-setting-filter-store-provider"

export default function DepartmentIdFormField() {
  const { control, setValue } = useFormContext<WorkerSettingFormInput>();

  const departments = useWorkerSettingFilterStore(state => state.departments);

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