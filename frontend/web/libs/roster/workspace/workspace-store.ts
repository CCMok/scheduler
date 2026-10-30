import { createStore } from "zustand/vanilla";
import {
  OffPerWorker,
  RosterItem,
  RosterJoin,
  Timeslot,
  parseRosterItems,
  toOffsPerWorker,
} from "@/libs/roster/roster";
import { datesToTimeslots } from "./date-presets";
import {
  AssignOnOffConflict,
  DayOpSnapshot,
  findAssignOnOffConflicts,
  swapDayContent,
} from "./day-ops";

export type WorkspaceMode = "off" | "assign";
/** Viewing vs mutating. Create always starts in edit; open saved roster starts in view. */
export type WorkspaceInteraction = "view" | "edit";

const DAY_UNDO_LIMIT = 40;

/** Last hydrate / save — target for resetToOriginal. */
export type WorkspaceBaseline = {
  name: string;
  timeslots: Timeslot[];
  offs: OffPerWorker[];
  workingRoster: RosterItem[];
  initialRoster: RosterItem[];
};

export type WorkspaceState = {
  teamId: number;
  rosterId: number | null;
  name: string;
  timeslots: Timeslot[];
  offs: OffPerWorker[];
  workingRoster: RosterItem[];
  initialRoster: RosterItem[];
  serverUpdatedAt: string | null;
  mode: WorkspaceMode;
  interaction: WorkspaceInteraction;
  selectedTimeslotId: number | null;
  dayUndoStack: DayOpSnapshot[];
  assignOnOffConflicts: AssignOnOffConflict[];
  baseline: WorkspaceBaseline;
};

export type WorkspaceActions = {
  setName: (name: string) => void;
  setMode: (mode: WorkspaceMode) => void;
  enterEdit: () => void;
  exitEdit: () => void;
  setTimeslotsFromDates: (dates: Date[]) => void;
  setOffs: (offs: OffPerWorker[]) => void;
  toggleOff: (workerId: number, timeslotId: number) => void;
  setWorkingRoster: (roster: RosterItem[]) => void;
  setArrangeResult: (items: RosterItem[]) => void;
  markSaved: (params: { rosterId: number; serverUpdatedAt: string }) => void;
  hydrateFromServer: (roster: RosterJoin) => void;
  hydrateNew: (teamId: number) => void;
  selectTimeslot: (timeslotId: number | null) => void;
  swapDays: (timeslotIdA: number, timeslotIdB: number) => void;
  undoDayOp: () => void;
  resetToOriginal: () => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

let nextClientTimeslotId = -1;

function remapOffsToTimeslots(offs: OffPerWorker[], timeslots: Timeslot[]): OffPerWorker[] {
  const ids = new Set(timeslots.map((t) => t.id));
  return offs
    .map((off) => ({
      ...off,
      timeslotIds: off.timeslotIds.filter((id) => ids.has(id)),
    }))
    .filter((off) => off.timeslotIds.length > 0);
}

/** Reuse timeslot ids for surviving date names; allocate only for new days. */
function reconcileTimeslots(
  prev: Timeslot[],
  dates: Date[],
  nextIdStart: number,
): { timeslots: Timeslot[]; nextClientTimeslotId: number } {
  const byName = new Map(prev.map((t) => [t.name, t]));
  const orderedNames = datesToTimeslots(dates, 1).map((t) => t.name);
  let nextId = nextIdStart;
  const timeslots = orderedNames.map((name) => {
    const keep = byName.get(name);
    if (keep) return keep;
    nextId -= 1;
    return { id: nextId, name };
  });
  return { timeslots, nextClientTimeslotId: nextId };
}

/** Keep assignments for surviving timeslot ids; empty cells for new days. */
function remapRosterToTimeslots(
  roster: RosterItem[],
  timeslots: Timeslot[],
  postIds: number[],
): RosterItem[] {
  let assignmentId = 1;
  for (const item of roster) {
    for (const a of item.assignments) {
      if (a.id >= assignmentId) assignmentId = a.id + 1;
    }
  }

  const ids = [...new Set([...roster.map((r) => r.postId), ...postIds])];
  return ids.map((postId) => {
    const existing = roster.find((r) => r.postId === postId);
    const byTimeslotId = new Map(
      (existing?.assignments ?? []).map((a) => [a.timeslotId, a]),
    );
    return {
      postId,
      assignments: timeslots.map((t) => {
        const prev = byTimeslotId.get(t.id);
        if (prev) {
          return { id: prev.id, timeslotId: t.id, workerId: prev.workerId };
        }
        return {
          id: assignmentId++,
          timeslotId: t.id,
          workerId: undefined as number | undefined,
        };
      }),
    };
  });
}

function baselineOf(slice: {
  name: string;
  timeslots: Timeslot[];
  offs: OffPerWorker[];
  workingRoster: RosterItem[];
  initialRoster: RosterItem[];
}): WorkspaceBaseline {
  return {
    name: slice.name,
    timeslots: slice.timeslots,
    offs: slice.offs,
    workingRoster: slice.workingRoster,
    initialRoster: slice.initialRoster,
  };
}

function stateFromServer(teamId: number, server: RosterJoin): WorkspaceState {
  const timeslots = server.timeslots.map((t) => ({ id: t.id, name: t.name }));
  const offs = toOffsPerWorker(
    server.timeslots.map((t) => ({
      timeslotId: t.id,
      workerIds: t.offWorkers.map((ow) => ow.workerId),
    })),
  );
  const items = parseRosterItems(server);
  const core = {
    name: server.name,
    timeslots,
    offs,
    workingRoster: items,
    initialRoster: items,
  };
  return {
    teamId,
    rosterId: server.id,
    ...core,
    serverUpdatedAt: server.updatedAt.toISOString(),
    mode: "assign",
    interaction: "view",
    selectedTimeslotId: null,
    dayUndoStack: [],
    assignOnOffConflicts: findAssignOnOffConflicts({
      workingRoster: items,
      offs,
    }),
    baseline: baselineOf(core),
  };
}

function stateForNew(teamId: number): WorkspaceState {
  const core = {
    name: "新值班表",
    timeslots: [] as Timeslot[],
    offs: [] as OffPerWorker[],
    workingRoster: [] as RosterItem[],
    initialRoster: [] as RosterItem[],
  };
  return {
    teamId,
    rosterId: null,
    ...core,
    serverUpdatedAt: null,
    mode: "off",
    interaction: "edit",
    selectedTimeslotId: null,
    dayUndoStack: [],
    assignOnOffConflicts: [],
    baseline: baselineOf(core),
  };
}

function snapshotOf(state: WorkspaceState): DayOpSnapshot {
  return {
    timeslots: state.timeslots,
    offs: state.offs,
    workingRoster: state.workingRoster,
    initialRoster: state.initialRoster,
    selectedTimeslotId: state.selectedTimeslotId,
  };
}

function sameTimeslotNames(a: Timeslot[], b: Timeslot[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]!.name !== b[i]!.name) return false;
  }
  return true;
}

/** True when every post/timeslot workerId matches (order-sensitive). */
function sameAssignmentWorkers(a: RosterItem[], b: RosterItem[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i]!;
    const right = b[i]!;
    if (left.postId !== right.postId) return false;
    if (left.assignments.length !== right.assignments.length) return false;
    for (let j = 0; j < left.assignments.length; j++) {
      const la = left.assignments[j]!;
      const ra = right.assignments[j]!;
      if (la.timeslotId !== ra.timeslotId || la.workerId !== ra.workerId) {
        return false;
      }
    }
  }
  return true;
}

function sameOffs(a: OffPerWorker[], b: OffPerWorker[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i]!;
    const right = b[i]!;
    if (left.workerId !== right.workerId) return false;
    if (left.timeslotIds.length !== right.timeslotIds.length) return false;
    for (let j = 0; j < left.timeslotIds.length; j++) {
      if (left.timeslotIds[j] !== right.timeslotIds[j]) return false;
    }
  }
  return true;
}

export function isAwayFromBaseline(state: WorkspaceState): boolean {
  const { baseline } = state;
  if (state.name !== baseline.name) return true;
  if (!sameTimeslotNames(state.timeslots, baseline.timeslots)) return true;
  if (!sameOffs(state.offs, baseline.offs)) return true;
  if (!sameAssignmentWorkers(state.workingRoster, baseline.workingRoster)) {
    return true;
  }
  return false;
}

function withDayConflicts(
  workingRoster: RosterItem[],
  offs: OffPerWorker[],
): Pick<WorkspaceState, "workingRoster" | "offs" | "assignOnOffConflicts"> {
  return {
    workingRoster,
    offs,
    assignOnOffConflicts: findAssignOnOffConflicts({ workingRoster, offs }),
  };
}

function pushDayUndo(
  stack: DayOpSnapshot[],
  snapshot: DayOpSnapshot,
): DayOpSnapshot[] {
  const next = [...stack, snapshot];
  if (next.length <= DAY_UNDO_LIMIT) return next;
  return next.slice(next.length - DAY_UNDO_LIMIT);
}

export function createWorkspaceStore(init: {
  teamId: number;
  roster?: RosterJoin;
  postIds: number[];
}) {
  const initial = init.roster
    ? stateFromServer(init.teamId, init.roster)
    : stateForNew(init.teamId);

  return createStore<WorkspaceStore>()((set, get) => ({
    ...initial,

    setName: (name) => set({ name }),
    setMode: (mode) => set({ mode }),
    enterEdit: () => set({ interaction: "edit" }),
    exitEdit: () =>
      set({
        interaction: "view",
        selectedTimeslotId: null,
      }),

    setTimeslotsFromDates: (dates) => {
      const state = get();
      const preview = datesToTimeslots(dates, 1);
      if (sameTimeslotNames(state.timeslots, preview)) return;

      const reconciled = reconcileTimeslots(
        state.timeslots,
        dates,
        nextClientTimeslotId,
      );
      nextClientTimeslotId = reconciled.nextClientTimeslotId;
      const { timeslots } = reconciled;
      const offs = remapOffsToTimeslots(state.offs, timeslots);
      const postIds = [
        ...new Set([
          ...state.workingRoster.map((r) => r.postId),
          ...init.postIds,
        ]),
      ];
      const workingRoster = remapRosterToTimeslots(
        state.workingRoster,
        timeslots,
        postIds,
      );
      const initialRoster =
        state.initialRoster.length === 0
          ? []
          : remapRosterToTimeslots(state.initialRoster, timeslots, postIds);
      const selectedTimeslotId =
        state.selectedTimeslotId != null &&
        timeslots.some((t) => t.id === state.selectedTimeslotId)
          ? state.selectedTimeslotId
          : null;
      set({
        timeslots,
        offs,
        workingRoster,
        initialRoster,
        selectedTimeslotId,
        dayUndoStack: pushDayUndo(state.dayUndoStack, snapshotOf(state)),
        assignOnOffConflicts: findAssignOnOffConflicts({
          workingRoster,
          offs,
        }),
      });
    },

    setOffs: (offs) => {
      const { workingRoster } = get();
      set(withDayConflicts(workingRoster, offs));
    },

    toggleOff: (workerId, timeslotId) => {
      const state = get();
      const offs = state.offs;
      const existing = offs.find((o) => o.workerId === workerId);
      let nextOffs: OffPerWorker[];
      if (!existing) {
        nextOffs = [...offs, { workerId, timeslotIds: [timeslotId] }];
      } else {
        const has = existing.timeslotIds.includes(timeslotId);
        const timeslotIds = has
          ? existing.timeslotIds.filter((id) => id !== timeslotId)
          : [...existing.timeslotIds, timeslotId];
        nextOffs = offs
          .map((o) => (o.workerId === workerId ? { ...o, timeslotIds } : o))
          .filter((o) => o.timeslotIds.length > 0);
      }
      set(withDayConflicts(state.workingRoster, nextOffs));
    },

    setWorkingRoster: (workingRoster) => {
      const state = get();
      if (sameAssignmentWorkers(state.workingRoster, workingRoster)) return;
      set({
        ...withDayConflicts(workingRoster, state.offs),
        dayUndoStack: pushDayUndo(state.dayUndoStack, snapshotOf(state)),
      });
    },

    setArrangeResult: (items) => {
      const { offs } = get();
      set({
        ...withDayConflicts(items, offs),
        initialRoster: items,
        mode: "assign",
        dayUndoStack: [],
      });
    },

    markSaved: ({ rosterId, serverUpdatedAt }) => {
      const state = get();
      set({
        rosterId,
        serverUpdatedAt,
        interaction: "view",
        selectedTimeslotId: null,
        dayUndoStack: [],
        baseline: baselineOf(state),
      });
    },

    hydrateFromServer: (roster) => {
      set(stateFromServer(roster.teamId, roster));
    },

    hydrateNew: (teamId) => {
      set(stateForNew(teamId));
    },

    selectTimeslot: (timeslotId) => set({ selectedTimeslotId: timeslotId }),

    swapDays: (timeslotIdA, timeslotIdB) => {
      if (timeslotIdA === timeslotIdB) return;
      const state = get();
      const workingRoster = swapDayContent({
        workingRoster: state.workingRoster,
        timeslotIdA,
        timeslotIdB,
      });
      if (sameAssignmentWorkers(state.workingRoster, workingRoster)) return;
      set({
        ...withDayConflicts(workingRoster, state.offs),
        dayUndoStack: pushDayUndo(state.dayUndoStack, snapshotOf(state)),
        selectedTimeslotId: timeslotIdB,
      });
    },

    undoDayOp: () => {
      const state = get();
      if (state.dayUndoStack.length === 0) return;
      const stack = [...state.dayUndoStack];
      const prev = stack.pop()!;
      set({
        timeslots: prev.timeslots,
        initialRoster: prev.initialRoster,
        selectedTimeslotId: prev.selectedTimeslotId,
        ...withDayConflicts(prev.workingRoster, prev.offs),
        dayUndoStack: stack,
      });
    },

    resetToOriginal: () => {
      const { baseline } = get();
      set({
        name: baseline.name,
        timeslots: baseline.timeslots,
        initialRoster: baseline.initialRoster,
        selectedTimeslotId: null,
        dayUndoStack: [],
        ...withDayConflicts(baseline.workingRoster, baseline.offs),
      });
    },
  }));
}
