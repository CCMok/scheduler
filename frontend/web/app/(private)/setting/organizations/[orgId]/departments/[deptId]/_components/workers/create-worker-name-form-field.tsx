import CustomFormItem from '@/components/_general/form/custom-form-item';
import CustomInput from '@/components/_general/input/custom-input';
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { CreateWorkerFormInput } from "@/libs/client/worker/models/create-worker-form-input";
import { useFormContext } from "react-hook-form";

export default function CreateWorkerNameFormField() {
  const { control } = useFormContext<CreateWorkerFormInput>()

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <CustomFormItem label='人員名稱'>
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