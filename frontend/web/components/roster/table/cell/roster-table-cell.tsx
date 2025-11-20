'use client'

import { PostBaseArrangement } from "@/libs/roster/models/schedule";
import { useState } from "react";
import RosterTableSelectionCell from "./roster-table-selection-cell";
import RosterTableSortableCell from "./roster-table-sortable-cell";
import { Worker } from "@/external/prisma-generated";
import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";

type Props = {
  arrangement: PostBaseArrangement;
  setArrangement: (arrangement: PostBaseArrangement) => void;
  workers: Worker[];
  offs?: OffFormInput[];
}

export default function RosterTableCell({
  arrangement,
  setArrangement,
  workers,
  offs,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <RosterTableSelectionCell
        arrangement={arrangement}
        setArrangement={setArrangement}
        workers={workers}
        setIsEditing={setIsEditing}
        offs={offs}
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