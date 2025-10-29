'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { OffFormInput } from '@/libs/client/roster/models/roster-filter-form-input';
import { Plus } from 'lucide-react';
import { useArrangeRosterStore } from '../../../../newOld/_components/store/arrange-roster-store-provider';

type Props = {
  onAppend: (value: OffFormInput) => void;
}

export default function OffFilterAddButton({
  onAppend,
}: Readonly<Props>) {
  const workers = useArrangeRosterStore(state => state.generatedScheduleWorkers);

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

