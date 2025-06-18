import { TableCell } from "@/external/shadcn/components/ui/table";
import { Arrangement } from "@/libs/server/roster/model/roster";
import { ComponentProps, useState } from "react";
import ComboBox from "@/components/combobox/combobox";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";
import { Worker } from "@/external/prisma-generated";

type Props = ComponentProps<typeof TableCell> & {
  arrangement: Arrangement;
}

export default function RosterTableSelectionCell({
  arrangement,
  ...props
}: Readonly<Props>) {
  const { workers } = useRosterStore(state => state)

  // TODO: temp
  const [worker, setWorker] = useState<Worker | undefined>(arrangement.worker)

  return (
    <TableCell {...props}>
      <ComboBox
        value={worker?.id.toString() ?? ''}
        options={workers}
        getValue={option => option.id.toString()}
        getDisplayName={option => option.name}
        onValueChange={value => setWorker(workers.find(worker => worker.id.toString() === value))}
      />
    </TableCell>
  )
}