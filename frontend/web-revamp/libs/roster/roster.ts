export type RosterDto = RosterPost[]

export type RosterPost = {
  post: {
    id: number;
    name: string;
  },
  assignments: RosterPostAssignment[];
}

export type RosterPostAssignment = {
  timeslot: string;
  worker?: {
    id: number;
    name: string;
  },
}