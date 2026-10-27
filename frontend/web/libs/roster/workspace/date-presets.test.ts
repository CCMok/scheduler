import { describe, expect, it } from "vitest";
import { datesToTimeslots, timeslotsToDates } from "./date-presets";

describe("datesToTimeslots / timeslotsToDates", () => {
  it("round-trips selected calendar dates via formatted names", () => {
    const dates = [
      new Date(2026, 9, 27),
      new Date(2026, 9, 28),
    ];
    const slots = datesToTimeslots(dates, 1);
    expect(slots).toHaveLength(2);
    expect(slots[0]?.id).toBe(1);
    const back = timeslotsToDates(slots);
    expect(back).toHaveLength(2);
    expect(back[0]?.getFullYear()).toBe(2026);
    expect(back[0]?.getMonth()).toBe(9);
    expect(back[0]?.getDate()).toBe(27);
  });
});
