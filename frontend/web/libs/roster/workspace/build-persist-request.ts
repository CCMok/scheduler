import { isNil } from "lodash";
import { OffPerWorker, RosterItem, Timeslot, toOffsPerWorker } from "@/libs/roster/roster";
import { TimeslotRequest as CreateTimeslotRequest } from "@/libs/roster/create/create-roster-request";

export function buildTimeslotPersistPayload(params: {
  timeslots: Timeslot[];
  workingRoster: RosterItem[];
  offs: OffPerWorker[];
}): CreateTimeslotRequest[] {
  const { timeslots, workingRoster, offs } = params;
  const offsPerTimeslot = new Map<number, number[]>();
  for (const off of offs) {
    for (const timeslotId of off.timeslotIds) {
      const list = offsPerTimeslot.get(timeslotId) ?? [];
      list.push(off.workerId);
      offsPerTimeslot.set(timeslotId, list);
    }
  }

  return timeslots.map((timeslot) => {
    const assignments: CreateTimeslotRequest["assignments"] = [];
    for (const item of workingRoster) {
      const assignment = item.assignments.find((a) => a.timeslotId === timeslot.id);
      if (!assignment) continue;
      assignments.push({
        postId: item.postId,
        workerId: isNil(assignment.workerId) ? undefined : assignment.workerId,
      });
    }

    return {
      name: timeslot.name,
      assignments,
      offWorkerIds: offsPerTimeslot.get(timeslot.id) ?? [],
    };
  });
}

export function offsFromTimeslotWorkerMap(
  timeslots: Timeslot[],
  offSet: ReadonlySet<string>,
): OffPerWorker[] {
  const byWorker = new Map<number, number[]>();
  for (const key of offSet) {
    const [workerIdRaw, timeslotIdRaw] = key.split(":");
    const workerId = Number(workerIdRaw);
    const timeslotId = Number(timeslotIdRaw);
    if (Number.isNaN(workerId) || Number.isNaN(timeslotId)) continue;
    if (!timeslots.some((t) => t.id === timeslotId)) continue;
    const list = byWorker.get(workerId) ?? [];
    list.push(timeslotId);
    byWorker.set(workerId, list);
  }
  return [...byWorker.entries()].map(([workerId, timeslotIds]) => ({
    workerId,
    timeslotIds,
  }));
}

export function offKey(workerId: number, timeslotId: number): string {
  return `${workerId}:${timeslotId}`;
}

export function offSetFromOffs(offs: OffPerWorker[]): Set<string> {
  const set = new Set<string>();
  for (const off of offs) {
    for (const timeslotId of off.timeslotIds) {
      set.add(offKey(off.workerId, timeslotId));
    }
  }
  return set;
}

/** Re-export helper used by older edit path naming. */
export { toOffsPerWorker };
