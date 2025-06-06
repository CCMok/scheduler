import { Post, Worker } from "@/external/prisma-generated";

export type Arrangement = {
  post: Post;
  worker?: Worker;
}

export type Schedule = {
  day: number;
  arrangements: Arrangement[];
}

export type ArrangeRosterResponse = Schedule[]