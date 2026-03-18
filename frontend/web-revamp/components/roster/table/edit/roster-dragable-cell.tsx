'use client'

import { TableCell } from "@/external/shadcn/components/ui/table";
import { cn } from "@/external/shadcn/libs/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, CSSProperties } from "react";

export default function RosterDragableCell({
  className,
  assignmentId,
  workerName,
  ...props
}: Readonly<{
  assignmentId: number;
  workerName?: string;
} & ComponentProps<typeof TableCell>>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: assignmentId,
    animateLayoutChanges: () => false,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      className={cn(
        'text-center cursor-grab',
        isDragging && 'opacity-50',
        className,
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      {workerName ?? '-'}
    </TableCell>
  )
}