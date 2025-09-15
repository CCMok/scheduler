export enum PostConstraintType {
  AT_LEAST_1_WORKER_PER_DAY = 0,
}

export enum WorkerConstraintType {
  CORRELATE = 0,
}

export const POST_CONSTRAINT_TYPE = {
  [PostConstraintType.AT_LEAST_1_WORKER_PER_DAY]: {
    displayName: '每節至少一人',
  },
} as const

export const WORKER_CONSTRAINT_TYPE = {
  [WorkerConstraintType.CORRELATE]: {
    displayName: '每節至少一人',
  },
} as const