'use client'

import { Roster } from "@/libs/roster/roster";
import { Dispatch, SetStateAction } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { formatDate } from "@/libs/_general/date/date-utils";
import { Post, Worker } from "@/external/prisma/generated/client";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function RosterTable({
  roster,
  setRoster,
  timeslots,
  posts,
  workers,
}: Readonly<{
  roster: Roster;
  setRoster: Dispatch<SetStateAction<Roster | undefined>>;
  timeslots: Date[];
  posts: Post[];
  workers: Worker[];
}>) {
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
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    // TODO
    // const swappedSchedules = swapSchedule(schedules, over.id, active.id)
    // setSchedules(swappedSchedules);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={}
        strategy={rectSwappingStrategy}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              {timeslots.map((timeslot) => (
                <TableHead key={timeslot.toISOString()}>
                  {formatDate(timeslot)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roster.posts.map((post) => (
              <TableRow key={post.postId}>
                <TableCell>{posts.find((p) => p.id === post.postId)?.name}</TableCell>
                {post.assignments.map((assignement) => (
                  <TableCell key={assignement.timeslot}>
                    {workers.find((w) => w.id === assignement.workerId)?.name}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  )
}