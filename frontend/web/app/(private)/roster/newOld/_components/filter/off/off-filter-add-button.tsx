'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { OffFormInput } from '@/libs/client/roster/models/roster-filter-form-input';
import { Plus } from 'lucide-react';
import { useArrangeRosterFilterStore } from '../store/arrange-roster-filter-store-provider';

type Props = {
  onAppend: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  onAppend,
}: Readonly<Props>) {
  const workers = useArrangeRosterFilterStore(state => state.workers);

  const onClick = () => onAppend({
    workerId: workers.length ? workers[0].id.toString() : '',
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