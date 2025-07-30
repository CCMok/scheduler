'use client';

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormControl, FormField } from "@/external/shadcn/components/ui/form";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";
import { useFormContext } from "react-hook-form";

export default function PostNameFormField() {
  const { control } = useFormContext<PostSettingFormInput>();

  return (
    <FormField
      control={control}
      name="postName"
      render={({ field }) => (
        <CustomFormItem label='職位名稱'>
          <FormControl>
            <CustomInput
              placeholder="搜尋..."
              {...field}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  );
} 