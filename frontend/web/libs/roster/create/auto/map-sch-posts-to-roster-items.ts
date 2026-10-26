import { isNil } from "lodash";
import { RosterItem, Timeslot } from "../../roster";
import { SchArrangePost } from "./sch-arrange-roster-response";

export function mapSchPostsToRosterItems(
  posts: SchArrangePost[],
  timeslots: Timeslot[],
): RosterItem[] {
  const timeslotMap = new Map(timeslots.map((t) => [t.name, t.id]));

  let assignmentCounter = 0;
  return posts.map((r) => ({
    postId: r.postId,
    assignments: r.timeslots.map((t) => {
      const timeslotId = timeslotMap.get(t.timeslot);
      if (isNil(timeslotId)) {
        console.error("Timeslot not found", t.timeslot);
      }
      return {
        id: ++assignmentCounter,
        timeslotId: timeslotId ?? 0,
        workerId: isNil(t.workerId) ? undefined : t.workerId,
      };
    }),
  }));
}
