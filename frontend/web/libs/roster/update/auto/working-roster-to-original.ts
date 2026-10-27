import { AutoModifyRosterRequest } from "./auto-modify-roster-request";

export function workingRosterToOriginalSchPosts(
  workingRoster: { postId: number; assignments: { timeslotId: number; workerId?: number }[] }[],
  timeslots: { id: number; name: string }[],
): AutoModifyRosterRequest["originalRoster"] {
  const nameById = new Map(timeslots.map((t) => [t.id, t.name]));
  return workingRoster.map((item) => ({
    postId: item.postId,
    timeslots: item.assignments.map((a) => ({
      timeslot: nameById.get(a.timeslotId) ?? "",
      workerId: a.workerId ?? null,
    })),
  }));
}
