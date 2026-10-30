import { describe, expect, it } from "vitest";
import { prioritiesFromRankOrder } from "./post";

describe("prioritiesFromRankOrder", () => {
  it("maps top of list to highest priority", () => {
    const map = prioritiesFromRankOrder([10, 20, 30]);
    expect(map.get(10)).toBe(2);
    expect(map.get(20)).toBe(1);
    expect(map.get(30)).toBe(0);
  });

  it("handles single and empty lists", () => {
    expect(prioritiesFromRankOrder([7]).get(7)).toBe(0);
    expect(prioritiesFromRankOrder([]).size).toBe(0);
  });
});
