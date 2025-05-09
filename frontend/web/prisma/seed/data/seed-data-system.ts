import { PostConstraintType, WorkerConstraintType } from "../../../libs/share/enums/constraint-type";

export const postConstraintTypes = [
  { name: 'At least 1 worker per day', enum: PostConstraintType.AT_LEAST_1_WORKER_PER_DAY },
]

export const workerConstraintTypes = [
  { name: 'Correlate', enum: WorkerConstraintType.CORRELATE },
]