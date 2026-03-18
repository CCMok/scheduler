'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import { TableCell } from "@/external/shadcn/components/ui/table";
import { useCallback, useEffect, useRef } from "react";
import { Worker } from "@/external/prisma/generated/client";
import { RosterItem } from "@/libs/roster/roster";

export default function RosterSelectionCell({
  assignmentId,
  workerId,
  workers,
  roster,
  setIsEditing,
  onRosterChange,
}: Readonly<{
  assignmentId: number;
  workerId?: number;
  workers: Worker[];
  roster: RosterItem[];
  setIsEditing: (isEditing: boolean) => void;
  onRosterChange: (roster: RosterItem[]) => void;
}>) {
  const ref = useRef<HTMLTableCellElement>(null);

  const onClickDocument = useCallback((event: MouseEvent) => {
    // Click outside of the cell and popover
    if (
      ref.current
      && !ref.current.contains(event.target as Node)
      && !(event.target as HTMLElement).closest('[data-slot="popover-content"]')
    ) {
      setIsEditing(false)
    }
  }, [setIsEditing])

  useEffect(() => {
    document.addEventListener('mousedown', onClickDocument);
    return () => document.removeEventListener('mousedown', onClickDocument);
  }, [onClickDocument])

  const setValue = (workerId?: number) => {
    const newRoster = roster.map(rosterItem => ({
      ...rosterItem,
      timeslots: rosterItem.assignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return { ...assignment, workerId }
        }
        return assignment;
      })
    }))

    onRosterChange(newRoster)
    setIsEditing(false)
  }

  return (
    <TableCell ref={ref} className="w-(--input-width)">
      <Combobox
        value={workerId}
        setValue={setValue}
        options={workers}
        getOptionValue={(worker) => worker.id}
        getOptionDisplay={(worker) => worker.name}
        isOptional={true}
        placeHolder="選擇職員"
        defaultIsOpen={true}
      />
    </TableCell>
  )
}