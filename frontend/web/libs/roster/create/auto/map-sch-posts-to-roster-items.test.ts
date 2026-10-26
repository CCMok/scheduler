import { describe, expect, it } from "vitest";
import { mapSchPostsToRosterItems } from "./map-sch-posts-to-roster-items";

describe("mapSchPostsToRosterItems", () => {
  it("maps timeslot names to timeslot ids", () => {
    const items = mapSchPostsToRosterItems(
      [
        {
          postId: 10,
          timeslots: [
            { timeslot: "A", workerId: 1 },
            { timeslot: "B", workerId: null },
          ],
        },
      ],
      [
        { id: 100, name: "A" },
        { id: 200, name: "B" },
      ],
    );

    expect(items).toEqual([
      {
        postId: 10,
        assignments: [
          { id: 1, timeslotId: 100, workerId: 1 },
          { id: 2, timeslotId: 200, workerId: undefined },
        ],
      },
    ]);
  });
});
