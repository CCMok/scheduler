import { z } from "zod";

export const schSolverStatusSchema = z.enum([
  "OPTIMAL",
  "FEASIBLE",
  "INFEASIBLE",
  "ERROR",
]);

export type SchSolverStatus = z.infer<typeof schSolverStatusSchema>;

const schArrangePostSchema = z.object({
  postId: z.number(),
  timeslots: z
    .object({
      timeslot: z.string(),
      workerId: z.number().nullish(),
    })
    .array(),
});

export type SchArrangePost = z.infer<typeof schArrangePostSchema>;

export const schArrangeRosterResponseSchema = z.object({
  status: schSolverStatusSchema,
  posts: schArrangePostSchema.array().nullish(),
  meta: z
    .object({
      solveMs: z.number().nullish(),
      // sch Pydantic dumps None as null — optional() alone rejects null
      hints: z.array(z.string()).nullish(),
    })
    .nullish(),
});

export type SchArrangeRosterResponse = z.infer<
  typeof schArrangeRosterResponseSchema
>;

export type SchArrangeSuccess = {
  kind: "success";
  status: "OPTIMAL" | "FEASIBLE";
  posts: SchArrangePost[];
};

export type SchArrangeFailure = {
  kind: "failure";
  status: "INFEASIBLE" | "ERROR";
};

export type SchArrangeInterpreted = SchArrangeSuccess | SchArrangeFailure;

/** Contract: never treat a bare array or empty posts without failure status as success. */
export function interpretSchArrangeResponse(
  raw: unknown,
): SchArrangeInterpreted {
  const parsed = schArrangeRosterResponseSchema.parse(raw);

  if (parsed.status === "OPTIMAL" || parsed.status === "FEASIBLE") {
    if (!parsed.posts || parsed.posts.length === 0) {
      return { kind: "failure", status: "ERROR" };
    }
    return {
      kind: "success",
      status: parsed.status,
      posts: parsed.posts,
    };
  }

  return { kind: "failure", status: parsed.status };
}
