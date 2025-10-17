'use client'

import { Arrangement } from "@/libs/share/roster/models/post-base-schedule";
import RosterTableSortableCell from "./roster-table-sortable-cell";
import { useState } from "react";
import RosterTableSelectionCell from "./roster-table-selection-cell";

type Props = {
  arrangement: Arrangement;
}

export default function RosterCell({
  arrangement,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false)

  const onDoubleClick = () => setIsEditing(isEditing => !isEditing)

  return (
    <>
      {isEditing ?
        <RosterTableSelectionCell
          setIsEditing={setIsEditing}
          arrangement={arrangement}
        />
        :
        <RosterTableSortableCell
          onDoubleClick={onDoubleClick}
          arrangement={arrangement}
        />
      }
    </>
  )
}