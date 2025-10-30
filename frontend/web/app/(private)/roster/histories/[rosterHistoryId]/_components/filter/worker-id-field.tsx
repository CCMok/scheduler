'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import { useArrangeRosterStore } from '../../../../new/_components/store/create-roster-store-provider';

type Props = {
  index: number;
}

export default function WorkerIdField({
  index
}: Readonly<Props>) {
  const workers = useArrangeRosterStore(state => state.generatedScheduleWorkers);
  const generatedScheduleOffs = useArrangeRosterStore(state => state.generatedScheduleOffs);
  const setGeneratedScheduleOffs = useArrangeRosterStore(state => state.setGeneratedScheduleOffs);

  const value = generatedScheduleOffs[index]?.workerId || '';

  const handleValueChange = (newValue: string | undefined) => {
    const newOffs = [...generatedScheduleOffs];
    if (newOffs[index]) {
      newOffs[index] = { ...newOffs[index], workerId: newValue || '' };
      setGeneratedScheduleOffs(newOffs);
    }
  };

  return (
    <ComboBox
      value={value}
      options={workers}
      getValue={option => option.id.toString()}
      getDisplayName={option => option.name}
      onValueChange={handleValueChange}
    />
  )
}

