'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { Plus } from 'lucide-react';
import { useCreateRosterStore } from '../../../../new/_components/store/create-roster-store-provider';
import { OffFormInput } from '@/app/(private)/roster/new/_components/filter/form/create-roster-form-input';

type Props = {
  onAppend: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  onAppend,
}: Readonly<Props>) {
  const workers = useCreateRosterStore(state => state.generatedScheduleWorkers);

  const onClick = () => onAppend({
    workerId: workers.length ? workers[0].id : 0,
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

