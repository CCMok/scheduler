'use client'

import { useMemo, useState } from "react"
import RosterSelectionCell from "./roster-selection-cell"
import RosterDragableCell from "./roster-dragable-cell"
import { Worker } from "@/external/prisma/generated/client"
import { RosterItem } from "@/libs/roster/roster"
import { isNil } from "lodash"

export default function RosterCellSwitch({
  assignmentId,
  workerId,
  originalWorkerId,
  workers,
  roster,
  isHighlighted = false,
  onRosterChange,
}: Readonly<{
  assignmentId: number;
  workerId?: number;
  originalWorkerId?: number;
  workers: Worker[];
  roster: RosterItem[];
  isHighlighted?: boolean;
  onRosterChange: (roster: RosterItem[]) => void;
}>) {
  const [isEditing, setIsEditing] = useState(false)

  const workerMap = useMemo(() => new Map(workers.map(worker => [worker.id, worker])), [workers])

  if (isEditing) {
    return (
      <RosterSelectionCell 
        assignmentId={assignmentId}
        workerId={workerId}
        workers={workers}
        roster={roster}
        setIsEditing={setIsEditing}
        onRosterChange={onRosterChange}
      />
    )
  }

  return (
    <RosterDragableCell 
      assignmentId={assignmentId}
      workerName={isNil(workerId) ? undefined : workerMap.get(workerId)?.name}
      originalWorkerName={isNil(originalWorkerId) ? undefined : workerMap.get(originalWorkerId)?.name}
      showOriginalValue={isHighlighted}
      className={isHighlighted ? 'bg-primary/10' : undefined}
      onDoubleClick={() => setIsEditing(true)}
    />
  )
}