'use client'

import { TableCell } from "@/external/shadcn/components/ui/table";
import { Arrangement } from "@/libs/server/roster/model/roster";
import { ComponentProps, Dispatch, SetStateAction, useEffect, useRef } from "react";
import ComboBox from "@/components/combobox/combobox";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Worker } from "@/external/prisma-generated";

const getUpdatedWorker = (arrangementId: UniqueIdentifier, existingArrangement: Arrangement, newWorker: Worker | undefined): Worker | undefined => {
  if (existingArrangement.id !== arrangementId) return existingArrangement.worker;
  return existingArrangement.worker?.id === newWorker?.id ? undefined : newWorker;
}

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

  const ref = useRef<HTMLTableCellElement>(null);

  const onClickOutside = (event: MouseEvent) => {
    if (
      ref.current
      && !ref.current.contains(event.target as Node)
      && !(event.target as HTMLElement).closest('[data-popover-content]')
    ) {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [])

  const onValueChange = (value: string) => {
    const newWorker = workers.find(worker => worker.id.toString() === value)

    const newSchedules = schedules.map(schedule => ({
      ...schedule,
      arrangements: schedule.arrangements.map(scheduleArrangement => ({
        ...scheduleArrangement,
        worker: getUpdatedWorker(arrangement.id, scheduleArrangement, newWorker),
      })),
    }))

    setSchedules(newSchedules);
    setIsEditing(false)
  }

  return (
    <TableCell ref={ref} {...props}>
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