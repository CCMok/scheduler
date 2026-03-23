import { Roster, RosterTimeslot, RosterTimeslotOffWorker, RosterTimeslotAssignment } from "@/external/prisma/generated/client";
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

export const offPerWorkerSchema = z.object({
  workerId: z.number(),
  timeslotIds: z.number().array(),
})

export type OffPerWorker = z.infer<typeof offPerWorkerSchema>;

export const offPerTimeslotSchema = z.object({
  timeslotId: z.number(),
  workerIds: z.number().array(),
})

export type OffPerTimeslot = z.infer<typeof offPerTimeslotSchema>;

export type RosterJoin = Roster & {
  timeslots: (RosterTimeslot & {
    assignments: RosterTimeslotAssignment[];
    offWorkers: RosterTimeslotOffWorker[];
  })[];
}

export const parseRosterItems = (roster: RosterJoin): RosterItem[] => {
  const postMap = new Map<number, RosterItem>();

  for (const timeslot of roster.timeslots) {
    for (const assignment of timeslot.assignments) {
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