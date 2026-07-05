import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { OffPerTimeslot, Timeslot } from "@/libs/roster/roster";
import { Worker } from "@/external/prisma/generated/client";
import { Badge } from "@/external/shadcn/components/ui/badge";
import { UserRound } from "lucide-react";

export default function OffTable({
  offs,
  timeslots,
  workers,
}: Readonly<{
  offs: OffPerTimeslot[];
  timeslots: Timeslot[];
  workers: Worker[];
}>) {
  const offMap = new Map(offs.map(off => [off.timeslotId, off]))
  const workerMap = new Map(workers.map(worker => [worker.id, worker]))
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>時段</TableHead>
          <TableHead>職員</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeslots.map(timeslot => {
          const targetOff = offMap.get(timeslot.id);
          return (
            <TableRow key={timeslot.id}>
              <TableCell>{timeslot.name}</TableCell>
              <TableCell className='space-x-2'>
                {targetOff?.workerIds.map((workerId) => {
                  const worker = workerMap.get(workerId);
                  return (
                    <Badge
                      key={workerId}
                      variant='secondary'
                    >
                      <UserRound />
                      {worker?.name}
                    </Badge>
                  )
                })}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}