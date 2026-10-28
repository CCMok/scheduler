import { OffPerWorker, RosterItem } from "@/libs/roster/roster";

export type DayOpSnapshot = {
  workingRoster: RosterItem[];
  offs: OffPerWorker[];
};

export type AssignOnOffConflict = {
  timeslotId: number;
  postId: number;
  workerId: number;
};

/** Content swap under fixed timeslot ids: workers (and offs) move; labels stay. */
export function swapDayContent(params: {
  workingRoster: RosterItem[];
  offs: OffPerWorker[];
  timeslotIdA: number;
  timeslotIdB: number;
}): DayOpSnapshot {
  const { workingRoster, offs, timeslotIdA, timeslotIdB } = params;
  if (timeslotIdA === timeslotIdB) {
    return { workingRoster, offs };
  }

  const nextRoster = workingRoster.map((item) => {
    const a = item.assignments.find((x) => x.timeslotId === timeslotIdA);
    const b = item.assignments.find((x) => x.timeslotId === timeslotIdB);
    if (!a && !b) return item;

    return {
      ...item,
      assignments: item.assignments.map((assignment) => {
        if (assignment.timeslotId === timeslotIdA) {
          return { ...assignment, workerId: b?.workerId };
        }
        if (assignment.timeslotId === timeslotIdB) {
          return { ...assignment, workerId: a?.workerId };
        }
        return assignment;
      }),
    };
  });

  const nextOffs = offs.map((off) => {
    const hasA = off.timeslotIds.includes(timeslotIdA);
    const hasB = off.timeslotIds.includes(timeslotIdB);
    if (!hasA && !hasB) return off;

    return {
      ...off,
      timeslotIds: off.timeslotIds.map((id) => {
        if (id === timeslotIdA) return timeslotIdB;
        if (id === timeslotIdB) return timeslotIdA;
        return id;
      }),
    };
  });

  return { workingRoster: nextRoster, offs: nextOffs };
}

function workerAt(
  workingRoster: RosterItem[],
  postId: number,
  timeslotId: number,
): number | undefined {
  const item = workingRoster.find((r) => r.postId === postId);
  return item?.assignments.find((a) => a.timeslotId === timeslotId)?.workerId;
}

/** Swap workers between two cells. Same cell = no-op. Offs unchanged. */
export function swapCellWorkers(params: {
  workingRoster: RosterItem[];
  postIdA: number;
  timeslotIdA: number;
  postIdB: number;
  timeslotIdB: number;
}): RosterItem[] {
  const { workingRoster, postIdA, timeslotIdA, postIdB, timeslotIdB } = params;
  if (postIdA === postIdB && timeslotIdA === timeslotIdB) {
    return workingRoster;
  }

  const workerA = workerAt(workingRoster, postIdA, timeslotIdA);
  const workerB = workerAt(workingRoster, postIdB, timeslotIdB);

  return workingRoster.map((item) => {
    const touchesA = item.postId === postIdA;
    const touchesB = item.postId === postIdB;
    if (!touchesA && !touchesB) return item;

    return {
      ...item,
      assignments: item.assignments.map((assignment) => {
        if (touchesA && assignment.timeslotId === timeslotIdA) {
          return { ...assignment, workerId: workerB };
        }
        if (touchesB && assignment.timeslotId === timeslotIdB) {
          return { ...assignment, workerId: workerA };
        }
        return assignment;
      }),
    };
  });
}

/** Clear workers for one day; offs unchanged. */
export function clearDayAssignments(
  workingRoster: RosterItem[],
  timeslotId: number,
): RosterItem[] {
  return workingRoster.map((item) => ({
    ...item,
    assignments: item.assignments.map((assignment) =>
      assignment.timeslotId === timeslotId
        ? { ...assignment, workerId: undefined }
        : assignment,
    ),
  }));
}

export function findAssignOnOffConflicts(params: {
  workingRoster: RosterItem[];
  offs: OffPerWorker[];
}): AssignOnOffConflict[] {
  const offSet = new Set<string>();
  for (const off of params.offs) {
    for (const timeslotId of off.timeslotIds) {
      offSet.add(`${off.workerId}:${timeslotId}`);
    }
  }

  const conflicts: AssignOnOffConflict[] = [];
  for (const item of params.workingRoster) {
    for (const assignment of item.assignments) {
      if (assignment.workerId == null) continue;
      if (offSet.has(`${assignment.workerId}:${assignment.timeslotId}`)) {
        conflicts.push({
          timeslotId: assignment.timeslotId,
          postId: item.postId,
          workerId: assignment.workerId,
        });
      }
    }
  }
  return conflicts;
}
