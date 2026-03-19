'use client'

import { Post, Worker } from "@/external/prisma/generated/client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { isNil } from "lodash";
import { useMemo } from "react";
import RosterCellSwitch from "./roster-cell-switch";
import { RosterItem, Timeslot } from "@/libs/roster/roster";

const swapWorker = (roster: RosterItem[], assignmentId1: UniqueIdentifier, assignmentId2: UniqueIdentifier): RosterItem[] => {
  let workerId1: number | undefined;
  let workerId2: number | undefined;

  // get workerId
  for (const rosterItem of roster) {
    for (const assignment of rosterItem.assignments) {
      if (assignment.id === assignmentId1) {
        workerId1 = assignment.workerId;
      }
      if (assignment.id === assignmentId2) {
        workerId2 = assignment.workerId;
      }
      if (!isNil(workerId1) && !isNil(workerId2)) {
        break;
      }
    }
  }

  // update worker
  return roster.map(rosterItem => ({
    ...rosterItem,
    assignments: rosterItem.assignments.map(assignment => ({
      ...assignment,
      workerId: (() => {
        if (assignment.id === assignmentId1) {
          return workerId2;
        }
        if (assignment.id === assignmentId2) {
          return workerId1;
        }
        return assignment.workerId;
      })(),
    }))
  }))
}

export default function RosterEditTable({
  timeslots,
  posts,
  workers,
  roster,
  onChange,
}: Readonly<{
  timeslots: Timeslot[];
  posts: Post[];
  workers: Worker[];
  roster: RosterItem[];
  onChange: (roster: RosterItem[]) => void;
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
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const newRoster = swapWorker(roster, active.id, over.id);
    onChange(newRoster);
  }

  const postMap = useMemo(() => new Map(posts.map(post => [post.id, post])), [posts])

  const sortedRoster = useMemo(() => roster.toSorted((a, b) => {
    const aPosition = postMap.get(a.postId)?.displayOrder ?? Infinity;
    const bPosition = postMap.get(b.postId)?.displayOrder ?? Infinity;
    return aPosition - bPosition;
  }), [roster])

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
                key={timeslot.id}
                className='text-center'
              >
                {timeslot.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={roster.flatMap(rosterItem => rosterItem.assignments.map(assignment => assignment.id))}
            strategy={rectSwappingStrategy}
          >
            {sortedRoster.map(rosterItem => (
              <TableRow key={rosterItem.postId}>
                <TableCell>{postMap.get(rosterItem.postId)?.name}</TableCell>
                {rosterItem.assignments.map(assignment => (
                  <RosterCellSwitch
                    key={assignment.id}
                    assignmentId={assignment.id}
                    workerId={assignment.workerId}
                    workers={workers}
                    roster={roster}
                    onRosterChange={onChange}
                  />
                ))}
              </TableRow>
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}