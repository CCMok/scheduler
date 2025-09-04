import CustomFormItem from '@/components/_general/form/custom-form-item';
import CustomInput from '@/components/_general/input/custom-input';
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { CreatePostFormInput } from "@/libs/client/post/models/create-post-form-input";
import { useFormContext } from "react-hook-form";

export default function CreatePostNameFormField() {
  const { control } = useFormContext<CreatePostFormInput>()

  return (
    <FormField
      control={control}
      name="postName"
      render={({ field }) => (
        <CustomFormItem label='職位名稱'>
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