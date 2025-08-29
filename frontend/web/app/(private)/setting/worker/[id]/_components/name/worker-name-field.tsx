'use client'

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form";
import { UpdateWorkerNameFormInput } from "@/libs/client/worker/models/update-worker-name-form-input";

type Props = {
  workerName: string;
}

export default function WorkerNameField({
  workerName,
}: Readonly<Props>) {
  const { control } = useFormContext<UpdateWorkerNameFormInput>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <CustomFormItem>
          <FormControl>
            <CustomInput
              {...field}
              placeholder={workerName}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}