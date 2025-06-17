"use client";

import { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell } from "@/external/shadcn/components/ui/table"
import { Arrangement } from '@/libs/server/roster/model/roster';

type Props = {
  arrangement: Arrangement;
}

export default function RosterTableCell({ arrangement }: Readonly<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: arrangement.id,
    animateLayoutChanges: () => false,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    textAlign: 'center',
  };

  return (
    <TableCell ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {arrangement.worker?.name ?? ''}
    </TableCell>
  )
}