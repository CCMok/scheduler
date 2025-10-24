'use client'

import ComboBox from "@/components/_general/combobox/combo-box"
import CustomFormItem from "@/components/_general/form/custom-form-item"
import { WorkerConstraintType } from "@/external/prisma-generated"
import { FormField } from "@/external/shadcn/components/ui/form"
import { CreateUpdateWorkerConstraintFormInput } from "@/libs/client/worker-constraint/models/create-update-worker-constraint-form-input"
import { useFormContext } from "react-hook-form"

type Props = {
  workerConstraintTypes: WorkerConstraintType[];
}

export default function WorkerConstraintTypeIdFormField({
  workerConstraintTypes,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateUpdateWorkerConstraintFormInput>()

  return (
    <FormField
      control={control}
      name="workerConstraintTypeId"
      render={({ field }) => (
        <CustomFormItem label='人員條件類型'>
          <ComboBox
            value={field.value}
            options={workerConstraintTypes}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('workerConstraintTypeId', value || '')}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}