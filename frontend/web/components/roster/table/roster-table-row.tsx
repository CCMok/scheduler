import { TableCell, TableRow } from "@/external/shadcn/components/ui/table";
import { PostBaseSchedule, Arrangement } from "@/libs/share/roster/models/post-base-schedule";
import RosterTableCell from "./cell/roster-table-cell";
import { Worker } from "@/external/prisma-generated";

type Props = {
  schedule: PostBaseSchedule;
  setSchedule: (schedule: PostBaseSchedule) => void;
  workers: Worker[];
}

export default function RosterTableRow({
  schedule,
  setSchedule,
  workers,
}: Readonly<Props>) {
  const setArrangement = (arrangement: Arrangement) => {
    const arrangements = schedule.arrangements.map(oldArrangement => ({
      ...(oldArrangement.id === arrangement.id ? arrangement : oldArrangement),
    }))
    const newSchedule = {
      ...schedule,
      arrangements,
    }
    setSchedule(newSchedule);
  }

  return (
    <TableRow>
      <TableCell className='py-4'>
        {schedule.post.name}
      </TableCell>
      {schedule.arrangements.map(arrangement => (
        <RosterTableCell
          key={arrangement.id}
          arrangement={arrangement}
          setArrangement={setArrangement}
          workers={workers}
        />
      ))}
    </TableRow>
  )
}