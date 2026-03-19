export type SchArrangeRosterRequest = {
  teamId: number;
  timeslots: string[];
  offs: {
    workerId: number;
    timeslots: string[];
  }[];
}