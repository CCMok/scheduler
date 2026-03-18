import { Post, Worker } from "@/external/prisma/generated/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { RosterItem, Timeslot } from "@/libs/roster/roster";
import { useMemo } from "react";

export default function RosterViewTable({
  timeslots,
  posts,
  workers,
  roster,
}: Readonly<{
  timeslots: Timeslot[];
  posts: Post[];
  workers: Worker[];
  roster: RosterItem[];
}>) {
  const postMap = new Map(posts.map(post => [post.id, post]))

  const sortedRoster = roster.toSorted((a, b) => {
    const aPosition = postMap.get(a.postId)?.displayOrder ?? Infinity;
    const bPosition = postMap.get(b.postId)?.displayOrder ?? Infinity;
    return aPosition - bPosition;
  })

  return (
    <Table>
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
        {sortedRoster.map(rosterItem => (
          <TableRow key={rosterItem.postId}>
            <TableCell>{postMap.get(rosterItem.postId)?.name}</TableCell>
            {rosterItem.assignments.map(assignment => (
              <TableCell
                key={assignment.id}
                className='text-center'
              >
                {assignment.worker?.}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}