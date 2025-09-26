import { Worker, WorkerConstraint, WorkerConstraintWorker, WorkerConstraintType } from "@/external/prisma-generated";

export type WorkerConstraintDao = Omit<WorkerConstraint, 'weighting'> & {
  weighting: number;
}

export type WorkerConstraintWorkers = WorkerConstraintDao & {
  workerConstraintWorkers: WorkerConstraintWorkerWorker[];
  workerConstraintType: WorkerConstraintType;
}

export type WorkerConstraintWorkerWorker = WorkerConstraintWorker & {
  worker: Worker;
}