'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { Worker } from "@/external/prisma-generated"
import { CreatePostWorkerFormInput } from '@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/posts/[postId]/_components/workers/assign/create-post-worker-form-input';

type Props = {
  workers: Worker[];
}

export default function WorkerIdFormField({
  workers,
}: Readonly<Props>) {
  const { control } = useFormContext<CreatePostWorkerFormInput>();

  return (
    <FormField
      control={control}
      name='workerId'
      render={({ field }) => (
        <CustomFormItem label='人員'>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => field.onChange(value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}