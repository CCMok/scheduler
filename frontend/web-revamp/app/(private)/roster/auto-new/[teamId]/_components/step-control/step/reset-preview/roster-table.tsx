'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAutoNewRosterStore } from "../store/auto-new-roster-store-provider";
import RosterTableSortableCell from "./roster-table-sortable-cell";
import { swapAssignment } from "@/libs/roster/roster-utils";

export default function RosterTable() {
  const modifiedRoster = useAutoNewRosterStore(state => state.modifiedRoster)
  const setModifiedRoster = useAutoNewRosterStore(state => state.setModifiedRoster)
  const timeslots = useAutoNewRosterStore(state => state.timeslots)

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

    const swappedRoster = swapAssignment(modifiedRoster, Number(over.id), Number(active.id))
    setModifiedRoster(swappedRoster);
  }

  return (
    // DndContext generate div for drag and drop function, and tbody only accept tr children. So DndContext place outside of table
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table>
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
            items={modifiedRoster.flatMap(rosterPost => rosterPost.assignments.map(assignment => assignment.id))}
            strategy={rectSwappingStrategy}
          >
            {modifiedRoster.map((rosterPost) => (
              <TableRow key={rosterPost.post.id}>
                <TableCell>{rosterPost.post.name}</TableCell>
                {timeslots.map(timeslot => {
                  const assignment = rosterPost.assignments.find(assignment => assignment.timeslot === timeslot)
                  if (!assignment) {
                    console.error(`Assignment not found for post: ${rosterPost.post.id} timeslot: ${timeslot}`);
                    return <TableCell key={timeslot} />;
                  }

                  return (
                    <RosterTableSortableCell
                      key={timeslot}
                      assignmentId={assignment.id}
                      workerName={assignment.worker?.name}
                    />
                  )
                })}
              </TableRow>
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}