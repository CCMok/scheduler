import { createStore } from "zustand/vanilla";
import {
  OffPerWorker,
  RosterItem,
  RosterJoin,
  Timeslot,
  parseRosterItems,
  toOffsPerWorker,
} from "@/libs/roster/roster";
import {
  RosterDraft,
  createEmptyDraft,
  draftKeyForNew,
  draftKeyForRoster,
  hasDraftConflict,
  readRosterDraft,
  writeRosterDraft,
  clearRosterDraft,
} from "@/libs/roster/draft/roster-draft";
import { datesToTimeslots } from "./date-presets";

export type WorkspaceMode = "off" | "assign";

export type WorkspaceState = {
  teamId: number;
  rosterId: number | null;
  name: string;
  timeslots: Timeslot[];
  offs: OffPerWorker[];
  workingRoster: RosterItem[];
  initialRoster: RosterItem[];
  serverUpdatedAt: string | null;
  dirty: boolean;
  mode: WorkspaceMode;
  conflictDraft: RosterDraft | null;
  /** false until client reads localStorage after mount — keeps SSR/hydration matched */
  localDraftReady: boolean;
};

export type WorkspaceActions = {
  setName: (name: string) => void;
  setMode: (mode: WorkspaceMode) => void;
  setTimeslotsFromDates: (dates: Date[]) => void;
  setOffs: (offs: OffPerWorker[]) => void;
  toggleOff: (workerId: number, timeslotId: number) => void;
  setWorkingRoster: (roster: RosterItem[]) => void;
  setArrangeResult: (items: RosterItem[]) => void;
  markSaved: (params: { rosterId: number; serverUpdatedAt: string }) => void;
  hydrateFromServer: (roster: RosterJoin) => void;
  hydrateNew: (teamId: number) => void;
  /** Call once after mount; never during store create (SSR-safe). */
  hydrateFromLocalDraft: () => void;
  resolveConflictKeepLocal: () => void;
  resolveConflictUseServer: (roster: RosterJoin) => void;
  persistDraft: () => void;
  clearDraft: () => void;
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

function toDraft(state: WorkspaceState): RosterDraft {
  return {
    version: "v1",
    teamId: state.teamId,
    rosterId: state.rosterId,
    name: state.name,
    timeslots: state.timeslots,
    offs: state.offs,
    workingRoster: state.workingRoster,
    initialRoster: state.initialRoster,
    serverUpdatedAt: state.serverUpdatedAt,
    dirty: state.dirty,
    savedAt: new Date().toISOString(),
  };
}

function applyDraft(draft: RosterDraft): Partial<WorkspaceState> {
  return {
    teamId: draft.teamId,
    rosterId: draft.rosterId,
    name: draft.name,
    timeslots: draft.timeslots,
    offs: draft.offs,
    workingRoster: draft.workingRoster,
    initialRoster: draft.initialRoster,
    serverUpdatedAt: draft.serverUpdatedAt,
    dirty: draft.dirty,
    conflictDraft: null,
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
  return {
    teamId,
    rosterId: server.id,
    name: server.name,
    timeslots,
    offs,
    workingRoster: items,
    initialRoster: items,
    serverUpdatedAt: server.updatedAt.toISOString(),
    dirty: false,
    mode: "assign",
    conflictDraft: null,
    localDraftReady: false,
  };
}

function stateForNew(teamId: number): WorkspaceState {
  return {
    ...createEmptyDraft({ teamId }),
    mode: "off",
    conflictDraft: null,
    localDraftReady: false,
  };
}

export function createWorkspaceStore(init: {
  teamId: number;
  roster?: RosterJoin;
  postIds: number[];
}) {
  /** Always server/empty baseline — never read localStorage here (hydration). */
  const initial = init.roster
    ? stateFromServer(init.teamId, init.roster)
    : stateForNew(init.teamId);

  return createStore<WorkspaceStore>()((set, get) => ({
    ...initial,

    setName: (name) => set({ name, dirty: true }),
    setMode: (mode) => set({ mode }),

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
      set({
        timeslots,
        offs,
        workingRoster: emptyGridForPosts(postIds, timeslots),
        initialRoster: [],
        dirty: true,
      });
    },

    setOffs: (offs) => set({ offs, dirty: true }),

    toggleOff: (workerId, timeslotId) => {
      const offs = get().offs;
      const existing = offs.find((o) => o.workerId === workerId);
      if (!existing) {
        set({
          offs: [...offs, { workerId, timeslotIds: [timeslotId] }],
          dirty: true,
        });
        return;
      }
      const has = existing.timeslotIds.includes(timeslotId);
      const timeslotIds = has
        ? existing.timeslotIds.filter((id) => id !== timeslotId)
        : [...existing.timeslotIds, timeslotId];
      set({
        offs: offs
          .map((o) => (o.workerId === workerId ? { ...o, timeslotIds } : o))
          .filter((o) => o.timeslotIds.length > 0),
        dirty: true,
      });
    },

    setWorkingRoster: (workingRoster) => set({ workingRoster, dirty: true }),

    setArrangeResult: (items) =>
      set({
        workingRoster: items,
        initialRoster: items,
        dirty: true,
        mode: "assign",
      }),

    markSaved: ({ rosterId, serverUpdatedAt }) => {
      const state = get();
      const key =
        state.rosterId == null
          ? draftKeyForNew(state.teamId)
          : draftKeyForRoster(state.rosterId);
      clearRosterDraft(key);
      if (state.rosterId == null) {
        clearRosterDraft(draftKeyForNew(state.teamId));
      }
      clearRosterDraft(draftKeyForRoster(rosterId));
      set({
        rosterId,
        serverUpdatedAt,
        dirty: false,
      });
    },

    hydrateFromServer: (roster) => {
      set({
        ...stateFromServer(roster.teamId, roster),
        localDraftReady: true,
      });
    },

    hydrateNew: (teamId) => {
      set({
        ...stateForNew(teamId),
        localDraftReady: true,
      });
    },

    hydrateFromLocalDraft: () => {
      if (get().localDraftReady) return;

      const state = get();
      if (state.rosterId != null) {
        const local = readRosterDraft(draftKeyForRoster(state.rosterId));
        const conflict =
          local &&
          hasDraftConflict({
            draft: local,
            serverUpdatedAt: state.serverUpdatedAt,
          })
            ? local
            : null;

        if (conflict) {
          set({ conflictDraft: conflict, localDraftReady: true });
          return;
        }

        if (local?.dirty) {
          set({
            ...applyDraft(local),
            mode: "assign",
            conflictDraft: null,
            localDraftReady: true,
          } as Partial<WorkspaceState>);
          return;
        }

        set({ localDraftReady: true });
        return;
      }

      const local = readRosterDraft(draftKeyForNew(state.teamId));
      if (local?.dirty) {
        set({
          ...applyDraft(local),
          mode: "off",
          conflictDraft: null,
          localDraftReady: true,
        } as Partial<WorkspaceState>);
        return;
      }

      set({ localDraftReady: true });
    },

    resolveConflictKeepLocal: () => {
      const draft = get().conflictDraft;
      if (!draft) return;
      set({
        ...applyDraft(draft),
        mode: "assign",
        conflictDraft: null,
        dirty: true,
        localDraftReady: true,
      } as Partial<WorkspaceState>);
    },

    resolveConflictUseServer: (roster) => {
      clearRosterDraft(draftKeyForRoster(roster.id));
      get().hydrateFromServer(roster);
    },

    persistDraft: () => {
      const state = get();
      if (!state.dirty || !state.localDraftReady) return;
      writeRosterDraft(toDraft(state));
    },

    clearDraft: () => {
      const state = get();
      const key =
        state.rosterId == null
          ? draftKeyForNew(state.teamId)
          : draftKeyForRoster(state.rosterId);
      clearRosterDraft(key);
    },
  }));
}
