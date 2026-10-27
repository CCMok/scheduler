import { describe, expect, it } from "vitest";
import {
  clearRosterDraft,
  createEmptyDraft,
  draftKeyForNew,
  draftKeyForRoster,
  hasDraftConflict,
  readRosterDraft,
  writeRosterDraft,
  type RosterDraft,
} from "./roster-draft";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    key: (index: number) => [...map.keys()][index] ?? null,
  };
}

describe("roster draft keys", () => {
  it("uses versioned keys for new and existing rosters", () => {
    expect(draftKeyForNew(3)).toBe("rosterDraft:v1:new:3");
    expect(draftKeyForRoster(9)).toBe("rosterDraft:v1:9");
  });
});

describe("hasDraftConflict", () => {
  const base: RosterDraft = {
    ...createEmptyDraft({ teamId: 1, rosterId: 10, serverUpdatedAt: "2026-01-01T00:00:00.000Z" }),
    dirty: true,
  };

  it("is false when draft missing or not dirty", () => {
    expect(hasDraftConflict({ draft: null, serverUpdatedAt: "2026-01-02T00:00:00.000Z" })).toBe(
      false,
    );
    expect(
      hasDraftConflict({
        draft: { ...base, dirty: false },
        serverUpdatedAt: "2026-01-02T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("is false when serverUpdatedAt matches draft baseline", () => {
    expect(
      hasDraftConflict({
        draft: base,
        serverUpdatedAt: "2026-01-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("is true when server was saved after draft baseline", () => {
    expect(
      hasDraftConflict({
        draft: base,
        serverUpdatedAt: "2026-01-02T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("accepts Date serverUpdatedAt", () => {
    expect(
      hasDraftConflict({
        draft: base,
        serverUpdatedAt: new Date("2026-01-02T00:00:00.000Z"),
      }),
    ).toBe(true);
  });
});

describe("roster draft storage", () => {
  it("round-trips draft and clears after save", () => {
    const storage = memoryStorage();
    const draft = createEmptyDraft({
      teamId: 2,
      rosterId: 5,
      name: "週表",
      serverUpdatedAt: "2026-03-01T00:00:00.000Z",
    });
    draft.dirty = true;
    draft.timeslots = [{ id: 1, name: "2026年3月1日" }];

    writeRosterDraft(draft, storage);
    const loaded = readRosterDraft(draftKeyForRoster(5), storage);
    expect(loaded?.name).toBe("週表");
    expect(loaded?.timeslots).toHaveLength(1);

    clearRosterDraft(draftKeyForRoster(5), storage);
    expect(readRosterDraft(draftKeyForRoster(5), storage)).toBeNull();
  });

  it("returns null for corrupt payload", () => {
    const storage = memoryStorage();
    storage.setItem(draftKeyForNew(1), "{not-json");
    expect(readRosterDraft(draftKeyForNew(1), storage)).toBeNull();
  });
});
