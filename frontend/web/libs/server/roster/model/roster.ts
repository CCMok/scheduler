import { Post, Worker } from "@/external/prisma-generated";

export type Roster = {
  schedules: Schedule[];
}

export type Schedule = {
  post: Post;
  arrangements: Arrangement[];
}

export type Arrangement = {
  id: number;
  day: number;
  worker: Worker | undefined;
}