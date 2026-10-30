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
  clearDayAssignments,
  findAssignOnOffConflicts,
  swapDayContent,
} from "./day-ops";

export type WorkspaceMode = "off" | "assign";
/** Viewing vs mutating. Create always starts in edit; open saved roster starts in view. */
export type WorkspaceInteraction = "view" | "edit";

const DAY_UNDO_LIMIT = 40;

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
  clearSelectedDay: () => void;
  undoDayOp: () => void;
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

function emptyGridForPosts(postIds: number[], timeslots: Timeslot[]): RosterItem[] {
  let assignmentId = 1;
  return postIds.map((postId) => ({
    postId,
    assignments: timeslots.map((t) => ({
      id: assignmentId++,
      timeslotId: t.id,
      workerId: undefined as number | undefined,
    })),
  }));
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
  return {
    teamId,
    rosterId: server.id,
    name: server.name,
    timeslots,
    offs,
    workingRoster: items,
    initialRoster: items,
    serverUpdatedAt: server.updatedAt.toISOString(),
    mode: "assign",
    interaction: "view",
    selectedTimeslotId: null,
    dayUndoStack: [],
    assignOnOffConflicts: findAssignOnOffConflicts({
      workingRoster: items,
      offs,
    }),
  };
}

function stateForNew(teamId: number): WorkspaceState {
  return {
    teamId,
    rosterId: null,
    name: "新值班表",
    timeslots: [],
    offs: [],
    workingRoster: [],
    initialRoster: [],
    serverUpdatedAt: null,
    mode: "off",
    interaction: "edit",
    selectedTimeslotId: null,
    dayUndoStack: [],
    assignOnOffConflicts: [],
  };
}

function snapshotOf(state: WorkspaceState): DayOpSnapshot {
  return { workingRoster: state.workingRoster };
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
      nextClientTimeslotId -= dates.length;
      const timeslots = datesToTimeslots(dates, nextClientTimeslotId);
      const offs = remapOffsToTimeslots(get().offs, timeslots);
      const postIds = [
        ...new Set([
          ...get().workingRoster.map((r) => r.postId),
          ...init.postIds,
        ]),
      ];
      const workingRoster = emptyGridForPosts(postIds, timeslots);
      set({
        timeslots,
        offs,
        workingRoster,
        initialRoster: [],
        selectedTimeslotId: null,
        dayUndoStack: [],
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
      set({
        rosterId,
        serverUpdatedAt,
        interaction: "view",
        selectedTimeslotId: null,
        dayUndoStack: [],
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

    clearSelectedDay: () => {
      const state = get();
      if (state.selectedTimeslotId == null) return;
      const timeslotId = state.selectedTimeslotId;
      const workingRoster = clearDayAssignments(
        state.workingRoster,
        timeslotId,
      );
      if (sameAssignmentWorkers(state.workingRoster, workingRoster)) return;
      set({
        ...withDayConflicts(workingRoster, state.offs),
        dayUndoStack: pushDayUndo(state.dayUndoStack, snapshotOf(state)),
      });
    },

    undoDayOp: () => {
      const state = get();
      if (state.dayUndoStack.length === 0) return;
      const stack = [...state.dayUndoStack];
      const prev = stack.pop()!;
      set({
        ...withDayConflicts(prev.workingRoster, state.offs),
        dayUndoStack: stack,
      });
    },
  }));
}
