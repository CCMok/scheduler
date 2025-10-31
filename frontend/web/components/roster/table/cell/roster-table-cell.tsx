'use client'

import { Arrangement } from "@/libs/share/roster/models/post-base-schedule";
import { useState } from "react";
import RosterTableSelectionCell from "./roster-table-selection-cell";
import RosterTableSortableCell from "./roster-table-sortable-cell";
import { Worker } from "@/external/prisma-generated";

type Props = {
  arrangement: Arrangement;
  setArrangement: (arrangement: Arrangement) => void;
  workers: Worker[];
}

export default function RosterTableCell({
  arrangement,
  setArrangement,
  workers,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <RosterTableSelectionCell
        arrangement={arrangement}
        setArrangement={setArrangement}
        workers={workers}
        setIsEditing={setIsEditing}
      />
    )
  }

  return (
    <RosterTableSortableCell
      arrangement={arrangement}
      onDoubleClick={() => setIsEditing(true)}
    />
  )
}