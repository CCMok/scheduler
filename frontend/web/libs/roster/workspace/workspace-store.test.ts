import { describe, expect, it } from "vitest";
import {
  createWorkspaceStore,
  isAwayFromBaseline,
} from "./workspace-store";
import type { RosterItem } from "@/libs/roster/roster";

function cellRoster(): RosterItem[] {
  return [
    {
      postId: 1,
      assignments: [
        { id: 1, timeslotId: -1, workerId: 10 },
        { id: 2, timeslotId: -2, workerId: 20 },
      ],
    },
  ];
}

describe("workspace undo", () => {
  it("undoes cell assign; leaves offs alone after toggle", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    const slots = store.getState().timeslots;
    expect(slots).toHaveLength(2);
    expect(store.getState().dayUndoStack).toHaveLength(1);

    store.getState().setWorkingRoster(
      cellRoster().map((item) => ({
        ...item,
        assignments: [
          { id: 1, timeslotId: slots[0]!.id, workerId: 10 },
          { id: 2, timeslotId: slots[1]!.id, workerId: 20 },
        ],
      })),
    );

    store.getState().toggleOff(10, slots[0]!.id);
    expect(store.getState().offs).toEqual([
      { workerId: 10, timeslotIds: [slots[0]!.id] },
    ]);
    expect(store.getState().dayUndoStack).toHaveLength(2);

    store.getState().setWorkingRoster(
      store.getState().workingRoster.map((item) => ({
        ...item,
        assignments: item.assignments.map((a) =>
          a.timeslotId === slots[0]!.id ? { ...a, workerId: 99 } : a,
        ),
      })),
    );
    expect(store.getState().dayUndoStack).toHaveLength(3);

    store.getState().undoDayOp();
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((a) => a.timeslotId === slots[0]!.id)
        ?.workerId,
    ).toBe(10);
    expect(store.getState().offs).toEqual([
      { workerId: 10, timeslotIds: [slots[0]!.id] },
    ]);
  });

  it("day swap does not move offs; undo leaves offs; toggleOff never pushes", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    const [a, b] = store.getState().timeslots;
    store.getState().setWorkingRoster([
      {
        postId: 1,
        assignments: [
          { id: 1, timeslotId: a!.id, workerId: 10 },
          { id: 2, timeslotId: b!.id, workerId: 20 },
        ],
      },
    ]);
    store.getState().toggleOff(10, a!.id);
    expect(store.getState().dayUndoStack).toHaveLength(2);

    store.getState().swapDays(a!.id, b!.id);
    expect(store.getState().offs[0]?.timeslotIds).toEqual([a!.id]);
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((x) => x.timeslotId === a!.id)
        ?.workerId,
    ).toBe(20);
    expect(store.getState().dayUndoStack).toHaveLength(3);

    store.getState().undoDayOp();
    expect(store.getState().offs[0]?.timeslotIds).toEqual([a!.id]);
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((x) => x.timeslotId === a!.id)
        ?.workerId,
    ).toBe(10);
  });

  it("undoes add / remove / clear dates", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    const two = store.getState().timeslots;
    expect(two).toHaveLength(2);

    store.getState().setTimeslotsFromDates([new Date("2026-03-01T00:00:00")]);
    expect(store.getState().timeslots).toHaveLength(1);
    expect(store.getState().dayUndoStack).toHaveLength(2);

    store.getState().undoDayOp();
    expect(store.getState().timeslots.map((t) => t.name)).toEqual(
      two.map((t) => t.name),
    );
    expect(store.getState().timeslots.map((t) => t.id)).toEqual(
      two.map((t) => t.id),
    );

    store.getState().setTimeslotsFromDates([]);
    expect(store.getState().timeslots).toHaveLength(0);

    store.getState().undoDayOp();
    expect(store.getState().timeslots.map((t) => t.id)).toEqual(
      two.map((t) => t.id),
    );
  });

  it("skips push when setWorkingRoster is no-op", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([new Date("2026-03-01T00:00:00")]);
    const roster = store.getState().workingRoster;
    store.getState().setWorkingRoster(roster);
    expect(store.getState().dayUndoStack).toHaveLength(1);
  });

  it("skips push when setTimeslotsFromDates is no-op", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    const dates = [new Date("2026-03-01T00:00:00")];
    store.getState().setTimeslotsFromDates(dates);
    const ids = store.getState().timeslots.map((t) => t.id);
    store.getState().setTimeslotsFromDates(dates);
    expect(store.getState().timeslots.map((t) => t.id)).toEqual(ids);
    expect(store.getState().dayUndoStack).toHaveLength(1);
  });
});

describe("workspace date reconcile", () => {
  it("keeps surviving day assignments when removing a day", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    const [a, b] = store.getState().timeslots;
    store.getState().setWorkingRoster([
      {
        postId: 1,
        assignments: [
          { id: 1, timeslotId: a!.id, workerId: 10 },
          { id: 2, timeslotId: b!.id, workerId: 20 },
        ],
      },
    ]);
    store.getState().toggleOff(10, a!.id);

    store.getState().setTimeslotsFromDates([new Date("2026-03-01T00:00:00")]);
    const kept = store.getState().timeslots[0]!;
    expect(kept.id).toBe(a!.id);
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((x) => x.timeslotId === kept.id)
        ?.workerId,
    ).toBe(10);
    expect(store.getState().workingRoster[0]?.assignments).toHaveLength(1);
    expect(store.getState().offs).toEqual([
      { workerId: 10, timeslotIds: [a!.id] },
    ]);
  });

  it("keeps old assignments when adding a day", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    store.getState().setTimeslotsFromDates([new Date("2026-03-01T00:00:00")]);
    const first = store.getState().timeslots[0]!;
    store.getState().setWorkingRoster([
      {
        postId: 1,
        assignments: [{ id: 1, timeslotId: first.id, workerId: 10 }],
      },
    ]);

    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    const slots = store.getState().timeslots;
    expect(slots[0]!.id).toBe(first.id);
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((x) => x.timeslotId === first.id)
        ?.workerId,
    ).toBe(10);
    expect(
      store
        .getState()
        .workingRoster[0]?.assignments.find((x) => x.timeslotId === slots[1]!.id)
        ?.workerId,
    ).toBeUndefined();
  });
});

describe("workspace reset", () => {
  it("resetToOriginal restores baseline and clears undo", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    expect(isAwayFromBaseline(store.getState())).toBe(false);

    store.getState().setTimeslotsFromDates([
      new Date("2026-03-01T00:00:00"),
      new Date("2026-03-02T00:00:00"),
    ]);
    store.getState().setName("暫名");
    expect(isAwayFromBaseline(store.getState())).toBe(true);

    store.getState().resetToOriginal();
    expect(store.getState().timeslots).toHaveLength(0);
    expect(store.getState().name).toBe("新值班表");
    expect(store.getState().dayUndoStack).toHaveLength(0);
    expect(isAwayFromBaseline(store.getState())).toBe(false);
  });
});

describe("workspace interaction", () => {
  it("create starts in edit; enter/exit toggles", () => {
    const store = createWorkspaceStore({ teamId: 1, postIds: [1] });
    expect(store.getState().interaction).toBe("edit");
    store.getState().exitEdit();
    expect(store.getState().interaction).toBe("view");
    store.getState().enterEdit();
    expect(store.getState().interaction).toBe("edit");
  });
});
