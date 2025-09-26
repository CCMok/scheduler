import { Worker, WorkerConstraint, WorkerConstraintWorker, WorkerConstraintType } from "@/external/prisma-generated";

export type WorkerConstraintWorkers = WorkerConstraint & {
  workerConstraintWorkers: WorkerConstraintWorkerWorker[];
  workerConstraintType: WorkerConstraintType;
}

export type WorkerConstraintWorkerWorker = WorkerConstraintWorker & {
  worker: Worker;
}