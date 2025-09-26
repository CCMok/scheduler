'use client'

import { CreateUpdatePostConstraintFormInput } from "@/libs/client/post-constraint/models/create-update-post-constraint-form-input";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from '@/components/_general/form/custom-form-item';
import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { Post } from "@/external/prisma-generated";

type Props = {
  posts: Post[];
}

export default function PostsField({
  posts,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateUpdatePostConstraintFormInput>();

  return (
    <FormField
      control={control}
      name='posts'
      render={({ field }) => (
        <CustomFormItem label='職位'>
          <MultiSelectCombobox
            values={field.value.map(post => post.id)}
            options={posts}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={values => setValue('posts', values.map(value => ({ id: value })))}
            badgeVariant="inverted"
          />
        </CustomFormItem>
      )}
    />
  )
}