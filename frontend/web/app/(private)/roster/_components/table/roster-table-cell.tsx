'use client'

import { Arrangement } from "@/libs/server/roster/model/roster";
import RosterTableSortableCell from "./roster-table-sortable-cell";
import { useState } from "react";
import RosterTableSelectionCell from "./roster-table-selection-cell";

type Props = {
  arrangement: Arrangement;
}

export default function RosterCell({
  arrangement,
}: Readonly<Props>) {
  // TODO: turn off edit mode when click outside
  
  const [isEditing, setIsEditing] = useState(false)

  const onDoubleClick = () => setIsEditing(isEditing => !isEditing)

  return (
    <>
      {isEditing ?
        <RosterTableSelectionCell
          onDoubleClick={onDoubleClick}
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