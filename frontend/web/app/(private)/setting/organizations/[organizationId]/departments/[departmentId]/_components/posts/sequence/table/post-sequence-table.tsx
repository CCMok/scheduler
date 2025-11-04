'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import PostRow from "./post-row"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/external/shadcn/components/ui/table"
import { usePostSequenceStore } from "../store/post-sequence-store-provider"

export default function PostSequenceTable() {
  const posts = usePostSequenceStore(state => state.posts);
  const setPosts = usePostSequenceStore(state => state.setPosts);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return

    const oldIndex = posts.findIndex(post => post.id === active.id);
    const newIndex = posts.findIndex(post => post.id === over?.id);

    const newPosts = arrayMove(posts, oldIndex, newIndex);
    setPosts(newPosts);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>職位</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={posts}
              strategy={verticalListSortingStrategy}
            >
              {posts.map(post => (
                <PostRow key={post.id} post={post} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground text-sm text-center">
        拖放職位，調整值班表職位順序。
      </p>
    </DndContext>
  )
}