import { Post, Worker } from "@/external/prisma/generated/client";

export type WorkerPost = Worker & {
  posts: Post[];
}