'use client'

import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from '@dnd-kit/utilities';

type Props = {
  id: number;
}

export default function PostItem({
  id,
}: Readonly<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <h1>{id}</h1>
    </div>
  )
}