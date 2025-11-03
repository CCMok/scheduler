import { Worker, WorkerConstraint, WorkerConstraintWorker, WorkerConstraintType } from "@/external/prisma-generated";

export type WorkerConstraintDao = Omit<WorkerConstraint, 'weighting'> & {
  weighting: number;
}

export type WorkerConstraintWithRelated = WorkerConstraintDao & {
  workerConstraintWorkers: WorkerConstraintWorkerWithWorker[];
  workerConstraintType: WorkerConstraintType;
}

export type WorkerConstraintWorkerWithWorker = WorkerConstraintWorker & {
  worker: Worker;
}