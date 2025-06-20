'use client'

import { TableCell } from "@/external/shadcn/components/ui/table";
import { Arrangement } from "@/libs/share/roster/models/post-base-schedule";
import { ComponentProps, Dispatch, SetStateAction, useEffect, useRef } from "react";
import ComboBox from "@/components/combobox/combobox";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
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
  const { postBaseSchedules, workers, setPostBaseSchedules } = useArrangeRosterStore(state => state)

  const ref = useRef<HTMLTableCellElement>(null);

  const onClickDocument = (event: MouseEvent) => {
    // Click outside of the cell and popover
    if (
      ref.current
      && !ref.current.contains(event.target as Node)
      && !(event.target as HTMLElement).closest('[data-popover-content]')
    ) {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onClickDocument);
    return () => document.removeEventListener('mousedown', onClickDocument);
  }, [])

  const onValueChange = (value: string) => {
    const newWorker = workers.find(worker => worker.id.toString() === value)

    const newSchedules = postBaseSchedules.map(schedule => ({
      ...schedule,
      arrangements: schedule.arrangements.map(scheduleArrangement => ({
        ...scheduleArrangement,
        worker: getUpdatedWorker(arrangement.id, scheduleArrangement, newWorker),
      })),
    }))

    setPostBaseSchedules(newSchedules);
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