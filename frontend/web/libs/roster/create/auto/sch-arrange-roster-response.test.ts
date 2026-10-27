import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { interpretSchArrangeResponse } from "./sch-arrange-roster-response";

const samplePosts = [
  {
    postId: 1,
    timeslots: [{ timeslot: "日班", workerId: 3 }],
  },
];

describe("interpretSchArrangeResponse", () => {
  it("maps OPTIMAL with posts to success", () => {
    const result = interpretSchArrangeResponse({
      status: "OPTIMAL",
      posts: samplePosts,
      meta: { solveMs: 12 },
    });

    expect(result).toEqual({
      kind: "success",
      status: "OPTIMAL",
      posts: samplePosts,
    });
  });

  it("accepts sch meta with null hints (Pydantic None dump)", () => {
    const result = interpretSchArrangeResponse({
      status: "OPTIMAL",
      posts: samplePosts,
      meta: { solveMs: 42, hints: null },
    });

    expect(result).toEqual({
      kind: "success",
      status: "OPTIMAL",
      posts: samplePosts,
    });
  });

  it("maps FEASIBLE with posts to success (approximate)", () => {
    const result = interpretSchArrangeResponse({
      status: "FEASIBLE",
      posts: samplePosts,
    });

    expect(result).toEqual({
      kind: "success",
      status: "FEASIBLE",
      posts: samplePosts,
    });
  });

  it("maps INFEASIBLE to failure (never empty success)", () => {
    const result = interpretSchArrangeResponse({
      status: "INFEASIBLE",
      posts: null,
    });

    expect(result).toEqual({
      kind: "failure",
      status: "INFEASIBLE",
    });
  });

  it("rejects OPTIMAL with empty posts as ERROR failure", () => {
    const result = interpretSchArrangeResponse({
      status: "OPTIMAL",
      posts: [],
    });

    expect(result).toEqual({
      kind: "failure",
      status: "ERROR",
    });
  });

  it("rejects legacy bare array (breaking — no false success)", () => {
    expect(() => interpretSchArrangeResponse([])).toThrow(ZodError);
  });
});
