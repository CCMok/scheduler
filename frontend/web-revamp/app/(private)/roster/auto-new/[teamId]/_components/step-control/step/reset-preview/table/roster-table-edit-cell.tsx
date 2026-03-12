'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import { Worker } from "@/external/prisma/generated/client";
import { TableCell } from "@/external/shadcn/components/ui/table";
import { useAutoNewRosterStore } from "../../store/auto-new-roster-store-provider";
import { useCallback, useEffect, useRef } from "react";

export default function RosterTableEditCell({
  assignmentId,
  workerId,
  workers,
  setIsEditing,
}: Readonly<{
  assignmentId: number;
  workerId?: number;
  workers: Worker[];
  setIsEditing: (isEditing: boolean) => void;
}>) {
  const updateAssignmentWorker = useAutoNewRosterStore(state => state.updateAssignmentWorker)

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
    updateAssignmentWorker(assignmentId, workerId);
    setIsEditing(false);
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