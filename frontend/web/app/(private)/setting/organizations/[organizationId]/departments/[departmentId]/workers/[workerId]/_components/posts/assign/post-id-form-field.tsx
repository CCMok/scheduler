'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { Post } from "@/external/prisma-generated"
import { CreateWorkerPostFormInput } from '@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/workers/[workerId]/_components/posts/assign/create-worker-post-form-input';

type Props = {
  posts: Post[];
}

export default function PostIdFormField({
  posts,
}: Readonly<Props>) {
  const { control } = useFormContext<CreateWorkerPostFormInput>();

  return (
    <FormField
      control={control}
      name='postId'
      render={({ field }) => (
        <CustomFormItem label='職位'>
          <ComboBox
            value={field.value}
            options={posts}
            getValue={option => option.id}
            getDisplayName={option => option.name}
            onValueChange={field.onChange}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}