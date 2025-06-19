import { Post, Worker } from "@/external/prisma-generated";

export type DayBaseSchedule = {
  day: number;
  arrangements: Arrangement[];
}

export type Arrangement = {
  id: number;
  post: Post;
  worker: Worker | undefined;
}