'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { WorkerFormInput } from '@/libs/client/organization/models/create-organization-form-input';
import { Plus } from 'lucide-react';

type Props = {
  onAppend: (value: WorkerFormInput) => void;
}

export default function WorkerAddButton({
  onAppend,
}: Readonly<Props>) {
  const onClick = () => onAppend({
    tempId: crypto.randomUUID(),
    name: '',
  })

  return (
    <CustomButton
      variant='outline'
      onClick={onClick}
    >
      <Plus />新增
    </CustomButton>
  )
}