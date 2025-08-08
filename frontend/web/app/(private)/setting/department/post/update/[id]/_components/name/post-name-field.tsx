'use client'

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form";
import { UpdatePostNameFormInput } from "@/libs/client/post/models/update-post-name-form-input";

type Props = {
  postName: string;
}

export default function PostNameField({
  postName,
}: Readonly<Props>) {
  const { control } = useFormContext<UpdatePostNameFormInput>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <CustomFormItem>
          <FormControl>
            <CustomInput
              {...field}
              placeholder={postName}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}