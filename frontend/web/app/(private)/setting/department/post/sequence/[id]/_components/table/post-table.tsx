'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import PostRow from "./post-row"
import { Post } from "@/external/prisma-generated"
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "@/external/shadcn/components/ui/table"

type Props = {
  posts: Post[];
}

export default function PostTable({
  posts,
}: Readonly<Props>) {
  const [dndPosts, setDndPosts] = useState(posts)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return

    setDndPosts(items => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);

      return arrayMove(items, oldIndex, newIndex);
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table>
        <TableCaption>
          編輯職位順序影響編排值班表的顯示次序。
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>職位</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={dndPosts}
            strategy={verticalListSortingStrategy}
          >
            {dndPosts.map(dndPost => (
              <PostRow key={dndPost.id} post={dndPost} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}