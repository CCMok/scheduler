import { z } from "zod";
import {
  offPerWorkerSchema,
  rosterItemSchema,
  timeslotSchema,
} from "@/libs/roster/roster";

export const ROSTER_DRAFT_VERSION = "v1" as const;

export const rosterDraftSchema = z.object({
  version: z.literal(ROSTER_DRAFT_VERSION),
  teamId: z.number(),
  rosterId: z.number().nullable(),
  name: z.string(),
  timeslots: timeslotSchema.array(),
  offs: offPerWorkerSchema.array(),
  workingRoster: rosterItemSchema.array(),
  initialRoster: rosterItemSchema.array(),
  /** ISO string from server at load / last sync; null for unsaved create */
  serverUpdatedAt: z.string().nullable(),
  dirty: z.boolean(),
  savedAt: z.string(),
});

export type RosterDraft = z.infer<typeof rosterDraftSchema>;

export function draftKeyForNew(teamId: number): string {
  return `rosterDraft:${ROSTER_DRAFT_VERSION}:new:${teamId}`;
}

export function draftKeyForRoster(rosterId: number): string {
  return `rosterDraft:${ROSTER_DRAFT_VERSION}:${rosterId}`;
}

export function draftStorageKey(draft: Pick<RosterDraft, "teamId" | "rosterId">): string {
  return draft.rosterId == null
    ? draftKeyForNew(draft.teamId)
    : draftKeyForRoster(draft.rosterId);
}

export type DraftConflictDecision = "keep-local" | "use-server";

/**
 * Edit open: local dirty draft conflicts when server was saved after draft baseline.
 */
export function hasDraftConflict(params: {
  draft: RosterDraft | null;
  serverUpdatedAt: string | Date | null | undefined;
}): boolean {
  const { draft, serverUpdatedAt } = params;
  if (!draft?.dirty || draft.rosterId == null) return false;
  if (!draft.serverUpdatedAt || !serverUpdatedAt) return false;
  const serverIso =
    serverUpdatedAt instanceof Date
      ? serverUpdatedAt.toISOString()
      : serverUpdatedAt;
  return draft.serverUpdatedAt !== serverIso;
}

export function readRosterDraft(
  key: string,
  storage: Pick<Storage, "getItem"> = globalThis.localStorage,
): RosterDraft | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return rosterDraftSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeRosterDraft(
  draft: RosterDraft,
  storage: Pick<Storage, "setItem"> = globalThis.localStorage,
): void {
  const key = draftStorageKey(draft);
  storage.setItem(key, JSON.stringify(draft));
}

export function clearRosterDraft(
  key: string,
  storage: Pick<Storage, "removeItem"> = globalThis.localStorage,
): void {
  storage.removeItem(key);
}

export function createEmptyDraft(params: {
  teamId: number;
  rosterId?: number | null;
  name?: string;
  serverUpdatedAt?: string | null;
}): RosterDraft {
  return {
    version: ROSTER_DRAFT_VERSION,
    teamId: params.teamId,
    rosterId: params.rosterId ?? null,
    name: params.name ?? "新值班表",
    timeslots: [],
    offs: [],
    workingRoster: [],
    initialRoster: [],
    serverUpdatedAt: params.serverUpdatedAt ?? null,
    dirty: false,
    savedAt: new Date().toISOString(),
  };
}
