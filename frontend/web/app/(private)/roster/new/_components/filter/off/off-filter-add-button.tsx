'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { Plus } from 'lucide-react';
import { useCreateRosterFilterStore } from '../store/create-roster-filter-store-provider';
import { CreateRosterFilterFormInput, CreateRosterFilterKey, OffFormInput } from '../form/create-roster-form-input';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMemo } from 'react';

type Props = {
  onAppend: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  onAppend,
}: Readonly<Props>) {
  const { control } = useFormContext<CreateRosterFilterFormInput>();

  const offs = useWatch({
    control,
    name: CreateRosterFilterKey.OFFS,
  })

  const workers = useCreateRosterFilterStore(state => state.workers);

  const firstWorker = useMemo(() => 
    workers.find(worker => 
      !offs.some(off => off.workerId === worker.id)
    )
  , [workers, offs])

  const onClick = () => onAppend({
    workerId: firstWorker?.id ?? 0,
    days: [],
  })

  return (
    <CustomButton
      variant='outline'
      onClick={onClick}
      disabled={!firstWorker}
    >
      <Plus />新增
    </CustomButton>
  )
}