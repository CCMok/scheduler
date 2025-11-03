import { Badge } from "@/external/shadcn/components/ui/badge";
import { MAX_DISPLAY_COUNT } from "@/libs/client/_general/constants/display-constant";
import { WorkerConstraintWorkerWithWorker } from "@/libs/server/worker-constraint/models/worker-constraint-dao";
import { User } from "lucide-react";

type Props = {
  workerConstraintWorkers: WorkerConstraintWorkerWithWorker[];
}

export default function WorkerConstraintTableWorker({
  workerConstraintWorkers,
}: Readonly<Props>) {
  const displayWorkers = workerConstraintWorkers.slice(0, MAX_DISPLAY_COUNT);

  return (
    <div className='space-x-1'>
      {displayWorkers.map(workerConstraintWorker => (
        <Badge key={workerConstraintWorker.id}>
          <User />
          {workerConstraintWorker.worker.name}
        </Badge>
      ))}
      {workerConstraintWorkers.length > MAX_DISPLAY_COUNT && (
        <Badge variant='secondary'>
          + {workerConstraintWorkers.length - MAX_DISPLAY_COUNT} 更多
        </Badge>
      )}
    </div>
  )
}