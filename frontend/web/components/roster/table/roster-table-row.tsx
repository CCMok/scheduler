import { TableCell, TableRow } from "@/external/shadcn/components/ui/table";
import { PostBaseSchedule, PostBaseArrangement } from "@/libs/roster/models/schedule";
import RosterTableCell from "./cell/roster-table-cell";
import { Worker } from "@/external/prisma-generated";
import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";

type Props = {
  schedule: PostBaseSchedule;
  setSchedule: (schedule: PostBaseSchedule) => void;
  workers: Worker[];
  offs?: OffFormInput[];
}

export default function RosterTableRow({
  schedule,
  setSchedule,
  workers,
  offs,
}: Readonly<Props>) {
  const setArrangement = (arrangement: PostBaseArrangement) => {
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
          offs={offs}
        />
      ))}
    </TableRow>
  )
}