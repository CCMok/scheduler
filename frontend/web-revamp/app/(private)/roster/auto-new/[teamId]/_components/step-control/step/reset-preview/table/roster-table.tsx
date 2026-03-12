'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAutoNewRosterStore } from "../../store/auto-new-roster-store-provider";
import RosterTableCell from "./roster-table-cell";
import { Post, Worker } from "@/external/prisma/generated/client";
import { useMemo } from "react";
import { isNil } from "lodash";

export default function RosterTable({
  posts,
  workers,
}: Readonly<{
  posts: Post[];
  workers: Worker[];
}>) {
  const modifiedRoster = useAutoNewRosterStore(state => state.modifiedRoster)
  const timeslots = useAutoNewRosterStore(state => state.timeslots)
  const swapAssignment = useAutoNewRosterStore(state => state.swapAssignment)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    swapAssignment(Number(over.id), Number(active.id));
  }

  const sortedPosts = useMemo(() => posts.toSorted((a, b) => a.displayOrder - b.displayOrder), [posts])
  const workerMap = useMemo(() => new Map(workers.map(worker => [worker.id, worker])), [workers])

  return (
    // DndContext generate div for drag and drop function, and tbody only accept tr children. So DndContext place outside of table
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table>
        <TableCaption>可以拖放，或連按兩次編輯。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead />
            {timeslots.map((timeslot) => (
              <TableHead
                key={timeslot}
                className='text-center'
              >
                {timeslot}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={modifiedRoster.flatMap(rosterItem => rosterItem.timeslots.map(timeslotItem => timeslotItem.id))}
            strategy={rectSwappingStrategy}
          >
            {sortedPosts.map(post => {
              const rosterPostItem = modifiedRoster.find(r => r.postId === post.id)
              if (!rosterPostItem) return <></>

              return (
                <TableRow key={post.id}>
                  <TableCell>{post.name}</TableCell>
                  {timeslots.map(timeslot => {
                    const rosterTimeslotItem = rosterPostItem.timeslots.find(r => r.timeslot === timeslot)
                    if (!rosterTimeslotItem) return <></>

                    const worker = isNil(rosterTimeslotItem.workerId) ? undefined : workerMap.get(rosterTimeslotItem.workerId)

                    return (
                      <RosterTableCell
                        key={timeslot}
                        assignmentId={rosterTimeslotItem.id}
                        worker={worker}
                        workers={workers}
                      />
                    )
                  })}
                </TableRow>
              )
            })}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}