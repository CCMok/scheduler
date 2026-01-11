export type Roster = {
  posts: PostArrangement[];
}

export type PostArrangement = {
  postId: number;
  assignments: Assignement[];
}

export type Assignement = {
  timeslot: Date[];
  workerId?: number;
}