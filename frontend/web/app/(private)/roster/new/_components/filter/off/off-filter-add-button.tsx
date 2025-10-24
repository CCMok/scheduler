'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { Plus } from 'lucide-react';
import { useCreateRosterFilterStore } from '../store/create-roster-filter-store-provider';
import { OffFormInput } from '../create-roster-form-input';

type Props = {
  append: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  append,
}: Readonly<Props>) {
  const workers = useCreateRosterFilterStore(state => state.workers);

  const onClick = () => append({
    workerId: workers[0]?.id,
    days: [],
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