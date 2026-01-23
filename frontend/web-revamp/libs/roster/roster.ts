import { Roster, RosterTimeslot as RosterTimeslotDao, RosterTimeslotAssignment as RosterTimeslotAssignmentDao, Post, Worker } from "@/external/prisma/generated/client";
import { z } from "zod";

// Communication
export const rosterTimeslotAssignmentSchema = z.object({
  postId: z.number(),
  workerId: z.number().optional(),
})
export type RosterTimeslotAssignment = z.infer<typeof rosterTimeslotAssignmentSchema>

export const rosterTimeslotSchema = z.object({
  timeslot: z.string(),
  assignments: rosterTimeslotAssignmentSchema.array(),
})
export type RosterTimeslot = z.infer<typeof rosterTimeslotSchema>

export const rosterDtoSchema = rosterTimeslotSchema.array()
export type RosterDto = z.infer<typeof rosterDtoSchema>

// Display
export type RosterPostAssignmentWorker = {
  id: number;
  name: string;
}

export type RosterPostAssignment = {
  id: number;
  timeslot: string;
  worker?: RosterPostAssignmentWorker,
}

export type RosterPost = {
  post: {
    id: number;
    name: string;
  },
  assignments: RosterPostAssignment[],
}

export type RosterDisplay = RosterPost[];

// Dao
export type RosterJoin = Roster & {
  timeslots: (RosterTimeslotDao & {
    assignments: (RosterTimeslotAssignmentDao & {
      post?: Post;
      worker?: Worker;
    })[];
  })[];
}