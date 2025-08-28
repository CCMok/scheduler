import { Role } from "../../../../libs/share/_general/enums/role";
import { PostConstraintType, WorkerConstraintType } from "../../../../libs/share/_general/enums/constraint-type";

export const postConstraintTypes = [
  { name: 'At least 1 worker per day', enum: PostConstraintType.AT_LEAST_1_WORKER_PER_DAY },
]

export const workerConstraintTypes = [
  { name: 'Correlate', enum: WorkerConstraintType.CORRELATE },
]

export const roles = [
  { name: 'System Admin', enum: Role.SYSTEM_ADMIN },
  { name: 'Organization Admin', enum: Role.ORGANIZATION_ADMIN },
  { name: 'Operator', enum: Role.OPERATOR },
]