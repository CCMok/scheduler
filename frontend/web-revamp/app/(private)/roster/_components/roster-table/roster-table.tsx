import { Post, Worker } from "@/external/prisma/generated/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { RosterJoin } from "@/libs/roster/roster";
import { convertToRosterDisplayByDao } from "@/libs/roster/roster-utils";

export default function RosterTable({
  roster,
  posts,
  workers,
}: Readonly<{
  roster: RosterJoin;
  posts: Post[];
  workers: Worker[];
}>) {
  const rosterDisplay = convertToRosterDisplayByDao(roster, posts, workers);
  const timeslots = rosterDisplay[0]?.assignments.map(assignment => assignment.timeslot) ?? []
  return (
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
        {rosterDisplay.map((rosterPost) => (
          <TableRow key={rosterPost.post.id}>
            <TableCell>{rosterPost.post.name}</TableCell>
            {timeslots.map(timeslot => {
              const assignment = rosterPost.assignments.find(assignment => assignment.timeslot === timeslot)
              if (!assignment) {
                console.error(`Assignment not found for post: ${rosterPost.post.id} timeslot: ${timeslot}`);
                return <TableCell key={timeslot} />;
              }

              return (
                <TableCell
                  key={timeslot}
                  className='text-center'
                >
                  {assignment.worker?.name ?? '-'}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}