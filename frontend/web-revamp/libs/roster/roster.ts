import { Roster, RosterTimeslot, RosterTimeslotOffWorker, RosterTimeslotPost } from "@/external/prisma/generated/client";
import { isNil } from "lodash";
import { z } from "zod";

export const rosterItemSchema = z.object({
  postId: z.number(),
  assignments: z.object({
    id: z.number(),
    timeslotId: z.number(),
    workerId: z.number().optional(),
  }).array(),
})

export type RosterItem = z.infer<typeof rosterItemSchema>;

export const timeslotSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type Timeslot = z.infer<typeof timeslotSchema>;

export const offSchema = z.object({
  workerId: z.number(),
  timeslotIds: z.number().array(),
})

export type Off = z.infer<typeof offSchema>;

export type RosterJoin = Roster & {
  timeslots: (RosterTimeslot & {
    posts: RosterTimeslotPost[];
    offWorkers: RosterTimeslotOffWorker[];
  })[];
}

export const parseRosterItems = (roster: RosterJoin): RosterItem[] => {
  const postMap = new Map<number, RosterItem>();

  for (const timeslot of roster.timeslots) {
    for (const assignment of timeslot.posts) {
      if (!postMap.has(assignment.postId)) {
        postMap.set(assignment.postId, {
          postId: assignment.postId,
          assignments: [],
        });
      }

      postMap.get(assignment.postId)!.assignments.push({
        id: assignment.id,
        timeslotId: timeslot.id,
        workerId: isNil(assignment.workerId) ? undefined : assignment.workerId,
      })
    }
  }

  return Array.from(postMap.values());
}