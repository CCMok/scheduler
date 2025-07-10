import { Post, Worker } from "@/external/prisma-generated";

export type PostBaseSchedule = {
  post: Post;
  arrangements: Arrangement[];
}

export type Arrangement = {
  id: number;
  day: Date;
  worker: Worker | undefined;
}