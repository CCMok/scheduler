'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { PostFormInput } from '@/libs/client/organization/models/create-organization-with-children-form-input';
import { Plus } from 'lucide-react';

type Props = {
  onAppend: (value: PostFormInput) => void;
}

export default function PostAddButton({
  onAppend,
}: Readonly<Props>) {
  const onClick = () => onAppend({ name: '' })

  return (
    <CustomButton
      variant='outline'
      onClick={onClick}
    >
      <Plus />新增
    </CustomButton>
  )
}