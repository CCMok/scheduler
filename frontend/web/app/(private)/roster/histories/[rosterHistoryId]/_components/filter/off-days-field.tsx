'use client'

import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { useMemo } from 'react';
import { compareAsc, format } from 'date-fns';
import { useCreateRosterStore } from '@/app/(private)/roster/new/_components/store/create-roster-store-provider';

type Props = {
  index: number;
}

export default function OffDaysField({
  index
}: Readonly<Props>) {
  const initialSchedules = useCreateRosterStore(state => state.initialSchedules);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);
  const setGeneratedScheduleOffs = useCreateRosterStore(state => state.setGeneratedScheduleOffs);

  const offDays = useMemo(() => {
    const uniqueDays = new Set<Date>();
    for (const schedule of initialSchedules) {
      for (const arrangement of schedule.arrangements) {
        uniqueDays.add(arrangement.day);
      }
    }
    
    return Array.from(uniqueDays)
      .sort(compareAsc)
      .map(day => ({
        value: day,
        name: format(day, 'yyyy/MM/dd'),
      }));
  }, [initialSchedules]);

  const value = generatedScheduleOffs[index]?.days ?? [];

  const handleValueChange = (newValue: string[]) => {
    const newOffs = [...generatedScheduleOffs];
    if (newOffs[index]) {
      newOffs[index] = { ...newOffs[index], days: newValue.map(day => new Date(day)) };
      setGeneratedScheduleOffs(newOffs);
    }
  };

  return (
    <MultiSelectCombobox
      values={value.map(day => day.toISOString())}
      options={offDays}
      getValue={option => option.value.toISOString()}
      getDisplayName={option => option.name}
      onValueChange={handleValueChange}
      badgeVariant="inverted"
    />
  )
}

