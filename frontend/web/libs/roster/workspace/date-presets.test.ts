import { describe, expect, it } from "vitest";
import {
  datesInMonthByWeekday,
  datesToTimeslots,
  timeslotsToDates,
  toggleWeekdayInMonth,
} from "./date-presets";

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

describe("toggleWeekdayInMonth", () => {
  // Oct 2026 Sundays: 4, 11, 18, 25
  const oct = new Date(2026, 9, 1);

  it("lists Sundays in that month only", () => {
    const sundays = datesInMonthByWeekday(oct, 0);
    expect(sundays.map((d) => d.getDate())).toEqual([4, 11, 18, 25]);
  });

  it("adds all matching weekdays when none selected", () => {
    const next = toggleWeekdayInMonth([], oct, 0);
    expect(next.map((d) => d.getDate())).toEqual([4, 11, 18, 25]);
  });

  it("adds only missing matching weekdays", () => {
    const next = toggleWeekdayInMonth(
      [new Date(2026, 9, 4), new Date(2026, 9, 5)],
      oct,
      0,
    );
    expect(
      next
        .map((d) => d.getDate())
        .toSorted((a, b) => a - b),
    ).toEqual([4, 5, 11, 18, 25]);
  });

  it("removes matching weekdays when all already selected", () => {
    const next = toggleWeekdayInMonth(
      [
        new Date(2026, 9, 4),
        new Date(2026, 9, 5),
        new Date(2026, 9, 11),
        new Date(2026, 9, 18),
        new Date(2026, 9, 25),
      ],
      oct,
      0,
    );
    expect(next.map((d) => d.getDate())).toEqual([5]);
  });

  it("does not touch the other displayed month", () => {
    const novSunday = new Date(2026, 10, 1);
    const next = toggleWeekdayInMonth([novSunday], oct, 0);
    expect(next.some((d) => d.getMonth() === 10 && d.getDate() === 1)).toBe(
      true,
    );
    expect(next.filter((d) => d.getMonth() === 9)).toHaveLength(4);
  });
});

