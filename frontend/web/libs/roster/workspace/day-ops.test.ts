import { describe, expect, it } from "vitest";
import {
  clearDayAssignments,
  findAssignOnOffConflicts,
  swapCellWorkers,
  swapDayContent,
} from "./day-ops";
import type { OffPerWorker, RosterItem } from "@/libs/roster/roster";

const roster: RosterItem[] = [
  {
    postId: 1,
    assignments: [
      { id: 1, timeslotId: 10, workerId: 100 },
      { id: 2, timeslotId: 20, workerId: 200 },
      { id: 3, timeslotId: 30, workerId: 300 },
    ],
  },
  {
    postId: 2,
    assignments: [
      { id: 4, timeslotId: 10, workerId: 101 },
      { id: 5, timeslotId: 20, workerId: 201 },
      { id: 6, timeslotId: 30, workerId: 301 },
    ],
  },
];

const offs: OffPerWorker[] = [
  { workerId: 100, timeslotIds: [10] },
  { workerId: 201, timeslotIds: [20, 30] },
];

describe("swapDayContent", () => {
  it("exchanges workers on every post; timeslot ids stay fixed", () => {
    const next = swapDayContent({
      workingRoster: roster,
      timeslotIdA: 10,
      timeslotIdB: 20,
    });

    expect(next[0]?.assignments).toEqual([
      { id: 1, timeslotId: 10, workerId: 200 },
      { id: 2, timeslotId: 20, workerId: 100 },
      { id: 3, timeslotId: 30, workerId: 300 },
    ]);
    expect(next[1]?.assignments).toEqual([
      { id: 4, timeslotId: 10, workerId: 201 },
      { id: 5, timeslotId: 20, workerId: 101 },
      { id: 6, timeslotId: 30, workerId: 301 },
    ]);
  });

  it("direct A↔C leaves middle day untouched", () => {
    const next = swapDayContent({
      workingRoster: roster,
      timeslotIdA: 10,
      timeslotIdB: 30,
    });

    expect(next[0]?.assignments[1]).toEqual({
      id: 2,
      timeslotId: 20,
      workerId: 200,
    });
    expect(next[0]?.assignments[0]?.workerId).toBe(300);
    expect(next[0]?.assignments[2]?.workerId).toBe(100);
  });

  it("no-op when same timeslot", () => {
    const next = swapDayContent({
      workingRoster: roster,
      timeslotIdA: 10,
      timeslotIdB: 10,
    });
    expect(next).toBe(roster);
  });
});

describe("clearDayAssignments", () => {
  it("clears workers for one day only", () => {
    const next = clearDayAssignments(roster, 20);
    expect(next[0]?.assignments.map((a) => a.workerId)).toEqual([
      100,
      undefined,
      300,
    ]);
    expect(next[1]?.assignments.map((a) => a.workerId)).toEqual([
      101,
      undefined,
      301,
    ]);
  });
});

describe("findAssignOnOffConflicts", () => {
  it("flags worker assigned on their off day", () => {
    const conflicts = findAssignOnOffConflicts({
      workingRoster: roster,
      offs,
    });
    expect(conflicts).toEqual([
      { timeslotId: 10, postId: 1, workerId: 100 },
      { timeslotId: 20, postId: 2, workerId: 201 },
    ]);
  });

  it("empty when no assign-on-off", () => {
    expect(
      findAssignOnOffConflicts({
        workingRoster: roster,
        offs: [{ workerId: 999, timeslotIds: [10] }],
      }),
    ).toEqual([]);
  });
});

describe("swapCellWorkers", () => {
  it("swaps workers across posts and days", () => {
    const next = swapCellWorkers({
      workingRoster: roster,
      postIdA: 1,
      timeslotIdA: 10,
      postIdB: 2,
      timeslotIdB: 20,
    });
    expect(workerIds(next, 1)).toEqual([201, 200, 300]);
    expect(workerIds(next, 2)).toEqual([101, 100, 301]);
  });

  it("swaps within same post across days", () => {
    const next = swapCellWorkers({
      workingRoster: roster,
      postIdA: 1,
      timeslotIdA: 10,
      postIdB: 1,
      timeslotIdB: 30,
    });
    expect(workerIds(next, 1)).toEqual([300, 200, 100]);
  });

  it("no-op on same cell", () => {
    const next = swapCellWorkers({
      workingRoster: roster,
      postIdA: 1,
      timeslotIdA: 10,
      postIdB: 1,
      timeslotIdB: 10,
    });
    expect(next).toBe(roster);
  });
});

function workerIds(items: RosterItem[], postId: number) {
  return items
    .find((i) => i.postId === postId)
    ?.assignments.map((a) => a.workerId);
}

describe("undo property: swap then reverse", () => {
  it("second swap restores bit-identical roster", () => {
    const once = swapDayContent({
      workingRoster: roster,
      timeslotIdA: 10,
      timeslotIdB: 20,
    });
    const twice = swapDayContent({
      workingRoster: once,
      timeslotIdA: 10,
      timeslotIdB: 20,
    });
    expect(twice).toEqual(roster);
  });
});
