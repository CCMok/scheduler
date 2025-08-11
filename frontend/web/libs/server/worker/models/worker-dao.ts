import { Post, Worker } from "@/external/prisma-generated";

export type WorkerPosts = Worker & {
  posts: Post[];
}