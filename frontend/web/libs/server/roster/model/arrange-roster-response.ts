import { Post, Worker } from "@/external/prisma-generated";

export type ArrangeRosterResponse = {
  schedules: Schedule[];
}

export type Schedule = {
  post: Post;
  arrangements: Arrangement[];
}

export type Arrangement = {
  day: number;
  worker: Worker | undefined;
}