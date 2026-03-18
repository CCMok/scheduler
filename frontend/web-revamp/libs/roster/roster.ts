export type RosterItem = {
  postId: number;
  assignments: {
    id: number;
    timeslotId: number;
    workerId?: number;
  }[];
}

export type Timeslot = {
  id: number;
  name: string;
}