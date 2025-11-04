import { Post, Worker } from "@/external/prisma-generated";

export type DayBaseSchedule = {
  day: Date;
  arrangements: DayBaseArrangement[];
}

export type DayBaseArrangement = {
  id: number;
  post: Post;
  worker: Worker | undefined;
}

export type PostBaseSchedule = {
  post: Post;
  arrangements: PostBaseArrangement[];
}

export type PostBaseArrangement = {
  id: number;
  day: Date;
  worker: Worker | undefined;
}