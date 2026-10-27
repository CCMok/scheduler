import { describe, expect, it } from "vitest";
import { workingRosterToOriginalSchPosts } from "./working-roster-to-original";

describe("workingRosterToOriginalSchPosts", () => {
  it("maps working grid timeslot ids to opaque names for sch modify", () => {
    const result = workingRosterToOriginalSchPosts(
      [
        {
          postId: 1,
          assignments: [
            { timeslotId: 10, workerId: 5 },
            { timeslotId: 11, workerId: undefined },
          ],
        },
      ],
      [
        { id: 10, name: "2026年10月27日" },
        { id: 11, name: "2026年10月28日" },
      ],
    );

    expect(result).toEqual([
      {
        postId: 1,
        timeslots: [
          { timeslot: "2026年10月27日", workerId: 5 },
          { timeslot: "2026年10月28日", workerId: null },
        ],
      },
    ]);
  });
});
