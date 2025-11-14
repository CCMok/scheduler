'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { Plus } from 'lucide-react';
import { useCreateRosterStore } from '../../../../new/_components/store/create-roster-store-provider';
import { OffFormInput } from '@/app/(private)/roster/new/_components/filter/form/create-roster-form-input';
import { useMemo } from 'react';

type Props = {
  onAppend: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  onAppend,
}: Readonly<Props>) {
  const workers = useCreateRosterStore(state => state.generatedScheduleWorkers);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);

  const firstWorker = useMemo(() => (
    workers.find(worker => (
      !generatedScheduleOffs.some(off => off.workerId === worker.id)
    ))
  ), [workers, generatedScheduleOffs])

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

