import { z } from "zod";
import { offPerWorkerSchema, timeslotSchema } from "../../roster";

/** Working-grid modify: never load stale DB assignments as originalRoster. */
export const autoModifyRosterRequestSchema = z.object({
  teamId: z.number(),
  /** Optional — when set, used only for existence / access when editing a saved roster. */
  rosterId: z.number().optional(),
  timeslots: timeslotSchema.array(),
  offs: offPerWorkerSchema.array(),
  originalRoster: z
    .object({
      postId: z.number(),
      timeslots: z
        .object({
          timeslot: z.string(),
          workerId: z.number().nullish(),
        })
        .array(),
    })
    .array(),
});

export type AutoModifyRosterRequest = z.infer<typeof autoModifyRosterRequestSchema>;
