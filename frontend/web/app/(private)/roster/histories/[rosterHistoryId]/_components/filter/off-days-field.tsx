'use client'

import MultiSelectCombobox from '@/components/_general/combobox/multi/multi-select-combobox';
import { useArrangeRosterStore } from '../../../../newOld/_components/store/arrange-roster-store-provider';
import { useMemo } from 'react';
import { format } from 'date-fns';

type Props = {
  index: number;
}

export default function OffDaysField({
  index
}: Readonly<Props>) {
  const initialSchedules = useArrangeRosterStore(state => state.initialSchedules);
  const generatedScheduleOffs = useArrangeRosterStore(state => state.generatedScheduleOffs);
  const setGeneratedScheduleOffs = useArrangeRosterStore(state => state.setGeneratedScheduleOffs);

  const offDays = useMemo(() => {
    const uniqueDays = new Set<string>();
    for (const schedule of initialSchedules) {
      for (const arrangement of schedule.arrangements) {
        uniqueDays.add(arrangement.day.toISOString());
      }
    }
    
    return Array.from(uniqueDays)
      .sort((a, b) => a.localeCompare(b))
      .map(dayStr => ({
        value: dayStr,
        name: format(new Date(dayStr), 'yyyy/MM/dd'),
      }));
  }, [initialSchedules]);

  const value = generatedScheduleOffs[index]?.days || [];

  const handleValueChange = (newValue: string[]) => {
    const newOffs = [...generatedScheduleOffs];
    if (newOffs[index]) {
      newOffs[index] = { ...newOffs[index], days: newValue };
      setGeneratedScheduleOffs(newOffs);
    }
  };

  return (
    <MultiSelectCombobox
      values={value}
      options={offDays}
      getValue={option => option.value}
      getDisplayName={option => option.name}
      onValueChange={handleValueChange}
      badgeVariant="inverted"
    />
  )
}

