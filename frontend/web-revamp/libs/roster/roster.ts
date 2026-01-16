// communication
export type RosterDto = {
  teamId: number;
  timeslots: RosterTimeslot[];
}

export type RosterTimeslot = {
  timeslot: string;
  assignments: RosterTimeslotAssignment[],
}

export type RosterTimeslotAssignment = {
  postId: number;
  workerId?: number;
}

// Display
export type PostBaseRoster = RosterPost[];

export type RosterPost = {
  post: {
    id: number;
    name: string;
  },
  assignments: RosterPostAssignment[],
}

export type RosterPostAssignment = {
  timeslot: string;
  worker?: {
    id: number;
    name: string;
  },
}