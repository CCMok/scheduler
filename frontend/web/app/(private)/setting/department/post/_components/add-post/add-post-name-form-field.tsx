import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { AddPostFormInput } from "@/libs/client/post/models/add-post-form-input";
import { useFormContext } from "react-hook-form";

export default function AddPostNameFormField() {
  const { control } = useFormContext<AddPostFormInput>()

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