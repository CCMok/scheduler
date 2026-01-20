'use client'

import { useState } from "react"
import RosterTableSortableCell from "./roster-table-sortable-cell"
import RosterTableEditCell from "./roster-table-edit-cell";
import { RosterPostAssignment } from "@/libs/roster/roster";
import { Worker } from "@/external/prisma/generated/client";

export default function RosterTableCell({
  workers,
  assignment,
}: Readonly<{
  workers: Worker[];
  assignment: RosterPostAssignment;
}>) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <RosterTableEditCell
        workers={workers}
        assignment={assignment}
        onValueChange={() => setIsEditing(false)}
      />
    )
  }

  return (
    <RosterTableSortableCell
      assignmentId={assignment.id}
      workerName={assignment.worker?.name}
      onDoubleClick={() => setIsEditing(true)}
    />
  )
}