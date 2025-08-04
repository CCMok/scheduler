import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { UpdatePostFormInput } from "@/libs/client/post/models/update-post-form-input";
import { useFormContext } from "react-hook-form";

export default function UpdatePostNameFormField() {
  const { control } = useFormContext<UpdatePostFormInput>()

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