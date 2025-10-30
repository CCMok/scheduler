'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import { useCreateRosterStore } from '../../../../new/_components/store/create-roster-store-provider';

type Props = {
  index: number;
}

export default function WorkerIdField({
  index
}: Readonly<Props>) {
  const workers = useCreateRosterStore(state => state.generatedScheduleWorkers);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);
  const setGeneratedScheduleOffs = useCreateRosterStore(state => state.setGeneratedScheduleOffs);

  const value = generatedScheduleOffs[index]?.workerId ?? 0;

  const handleValueChange = (newValue: number | undefined) => {
    const newOffs = [...generatedScheduleOffs];
    if (newOffs[index]) {
      newOffs[index] = { ...newOffs[index], workerId: newValue ?? 0 };
      setGeneratedScheduleOffs(newOffs);
    }
  };

  return (
    <ComboBox
      value={value}
      options={workers}
      getValue={option => option.id}
      getDisplayName={option => option.name}
      onValueChange={handleValueChange}
    />
  )
}

