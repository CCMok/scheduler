import { Post, Worker } from "@/external/prisma/generated/client";

/** Eligible worker for a post, with solver preference weight (higher = preferred). */
export type EligibleWorker = Worker & {
  priority: number;
};

export type PostWorker = Post & {
  workers: EligibleWorker[];
};

/** Map UI rank order (index 0 = most preferred) to stored priority values. */
export function prioritiesFromRankOrder(orderedWorkerIds: number[]): Map<number, number> {
  const n = orderedWorkerIds.length;
  const map = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    map.set(orderedWorkerIds[i], n - 1 - i);
  }
  return map;
}
