'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import PostItem from "./post-item"

export default function PostSequenceList() {
  const [items, setItems] = useState([1, 2, 3])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return

    setItems(items => {
      const oldIndex = items.indexOf(active.id as number);
      const newIndex = items.indexOf(over?.id as number);
      
      return arrayMove(items, oldIndex, newIndex);
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map(item => (
          <PostItem key={item} id={item} />
        ))}
      </SortableContext>
    </DndContext>
  )
}