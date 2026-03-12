'use client'

import { useState } from "react"
import RosterTableSortableCell from "./roster-table-sortable-cell"
import RosterTableEditCell from "./roster-table-edit-cell";
import { Worker } from "@/external/prisma/generated/client";

export default function RosterTableCell({
  assignmentId,
  worker,
  workers,
}: Readonly<{
  assignmentId: number;
  worker?: Worker;
  workers: Worker[];
}>) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <RosterTableEditCell
        assignmentId={assignmentId}
        workerId={worker?.id}
        workers={workers}
        setIsEditing={setIsEditing}
      />
    )
  }

  return (
    <RosterTableSortableCell
      assignmentId={assignmentId}
      workerName={worker?.name}
      onDoubleClick={() => setIsEditing(true)}
    />
  )
}