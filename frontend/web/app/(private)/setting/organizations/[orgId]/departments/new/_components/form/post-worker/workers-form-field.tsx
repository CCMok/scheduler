'use client'

import { CreateDepartmentFormInput } from "@/libs/client/department/models/create-department-form-input";
import { useFormContext, useWatch } from "react-hook-form";
import { DEFAULT_WORKERS } from "../create-department-default-value";
import { FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from "@/components/_general/form/custom-form-item";
import MultiSelectCombobox from "@/components/_general/combobox/multi/multi-select-combobox";

type Props = {
  index: number;
}

export default function WorkersFormField({
  index,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateDepartmentFormInput>();

  const workers = useWatch({
    control,
    name: 'workers',
    defaultValue: DEFAULT_WORKERS,
  })

  const onValueChange = (value: string[]) => {
    setValue(`postWorkers.${index}.workerTempIds`, value)
  }

  return (
    <FormField
      control={control}
      name={`postWorkers.${index}.workerTempIds`}
      render={({ field }) => (
        <CustomFormItem>
          <MultiSelectCombobox
            values={field.value}
            options={workers}
            getValue={option => option.tempId}
            getDisplayName={option => option.name}
            onValueChange={onValueChange}
            badgeVariant="inverted"
          />
        </CustomFormItem>
      )}
    />
  )
}