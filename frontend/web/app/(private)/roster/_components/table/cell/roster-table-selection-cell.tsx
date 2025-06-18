'use client'

import { TableCell } from "@/external/shadcn/components/ui/table";
import { Arrangement } from "@/libs/server/roster/model/roster";
import { ComponentProps, Dispatch, SetStateAction } from "react";
import ComboBox from "@/components/combobox/combobox";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";

type Props = ComponentProps<typeof TableCell> & {
  arrangement: Arrangement;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

export default function RosterTableSelectionCell({
  arrangement,
  setIsEditing,
  ...props
}: Readonly<Props>) {
  const { schedules, workers, setSchedules } = useRosterStore(state => state)

  const onValueChange = (value: string) => {
    const newWorker = workers.find(worker => worker.id.toString() === value)

    const newSchedules = schedules.map(schedule => ({
      ...schedule,
      arrangements: schedule.arrangements.map(scheduleArrangement => ({
        ...scheduleArrangement,
        worker: (() => {
          if (scheduleArrangement.id !== arrangement.id) return scheduleArrangement.worker;
          return scheduleArrangement.worker?.id === newWorker?.id ? undefined : newWorker;
        })(),
      })),
    }))

    setSchedules(newSchedules);
    setIsEditing(false)
  }

  return (
    <TableCell {...props}>
      <ComboBox
        value={arrangement.worker?.id.toString() ?? ''}
        options={workers}
        getValue={option => option.id.toString()}
        getDisplayName={option => option.name}
        onValueChange={onValueChange}
        defaultIsOpen
      />
    </TableCell>
  )
}