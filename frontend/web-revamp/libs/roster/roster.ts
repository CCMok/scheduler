import { z } from "zod";

export const rosterDisplaySchema = z.object({
  postId: z.number(),
  timeslots: z.object({
    id: z.number(),
    timeslot: z.string(),
    workerId: z.number().optional(),
  }).array(),
}).array();

export type RosterDisplay = z.infer<typeof rosterDisplaySchema>;


// Communication
// export const rosterTimeslotAssignmentSchema = z.object({
//   postId: z.number(),
//   workerId: z.number().optional(),
// })
// export type RosterTimeslotAssignment = z.infer<typeof rosterTimeslotAssignmentSchema>

// export const rosterTimeslotSchema = z.object({
//   timeslot: z.string(),
//   assignments: rosterTimeslotAssignmentSchema.array(),
// })
// export type RosterTimeslot = z.infer<typeof rosterTimeslotSchema>

// export const rosterDtoSchema = rosterTimeslotSchema.array()
// export type RosterDto = z.infer<typeof rosterDtoSchema>

// // Display
// export type RosterPostAssignmentWorker = {
//   id: number;
//   name: string;
// }

// export type RosterPostAssignment = {
//   id: number;
//   timeslot: string;
//   worker?: RosterPostAssignmentWorker,
// }

// export type RosterPost = {
//   post: {
//     id: number;
//     name: string;
//   },
//   assignments: RosterPostAssignment[],
// }

// export type RosterDisplay = RosterPost[];

// // Dao
// export type RosterJoin = Roster & {
//   timeslots: (RosterTimeslotDao & {
//     assignments: RosterTimeslotAssignmentDao[];
//   })[];
// }