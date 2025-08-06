import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { AddWorkerFormInput } from "@/libs/client/worker/models/add-worker-form-input";
import { useFormContext } from "react-hook-form";

export default function AddWorkerNameFormField() {
  const { control } = useFormContext<AddWorkerFormInput>()

  return (
    <FormField
      control={control}
      name="workerName"
      render={({ field }) => (
        <CustomFormItem label='員工名稱'>
          <FormControl>
            <CustomInput
              {...field}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}