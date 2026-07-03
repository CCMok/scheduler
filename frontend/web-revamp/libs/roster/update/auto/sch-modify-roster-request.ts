import { SchArrangeRosterRequest } from "../../create/auto/sch-arrange-roster-reqeust";

export type SchModifyRosterRequest = SchArrangeRosterRequest & {
  originalRoster: {
    postId: number;
    timeslots: {
      timeslot: string;
      workerId: number | null;
    }[];
  }[];
}
