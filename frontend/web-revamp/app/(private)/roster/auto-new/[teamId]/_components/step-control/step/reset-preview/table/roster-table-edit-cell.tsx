'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import { Worker } from "@/external/prisma/generated/client";
import { TableCell } from "@/external/shadcn/components/ui/table";
import { RosterPostAssignment } from "@/libs/roster/roster";
import { isNil } from "lodash";
import { useAutoNewRosterStore } from "../../store/auto-new-roster-store-provider";

export default function RosterTableEditCell({
  workers,
  assignment,
  onValueChange,
}: Readonly<{
  workers: Worker[];
  assignment: RosterPostAssignment;
  onValueChange: () => void;
}>) {
  const updateAssignmentWorker = useAutoNewRosterStore(state => state.updateAssignmentWorker)

  const setValue = (workerId: number | undefined) => {
    const worker = isNil(workerId) ? undefined : workers.find(worker => worker.id === workerId);
    const assignmentWorker = worker ? { id: worker.id, name: worker.name } : undefined
    updateAssignmentWorker(assignment.id, assignmentWorker);
    onValueChange();
  }

  return (
    <TableCell>
      <Combobox
        value={assignment.worker?.id}
        setValue={setValue}
        options={workers}
        getOptionValue={(worker) => worker.id}
        getOptionDisplay={(worker) => worker.name}
        isOptional={true}
        placeHolder="選擇職員"
      />
    </TableCell>
  )
}