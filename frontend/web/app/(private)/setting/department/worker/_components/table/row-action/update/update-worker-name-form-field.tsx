'use client';

import CustomFormItem from "@/components/form/custom-form-item";
import CustomInput from "@/components/input/custom-input";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form";

type UpdateWorkerFormInput = {
  workerName: string;
};

export default function UpdateWorkerNameFormField() {
  const { control } = useFormContext<UpdateWorkerFormInput>();

  return (
    <FormField
      control={control}
      name="workerName"
      render={({ field }) => (
        <CustomFormItem label="員工名稱">
          <CustomInput placeholder="請輸入員工名稱" {...field} />
        </CustomFormItem>
      )}
    />
  );
}