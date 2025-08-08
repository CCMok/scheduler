import { Post, Worker } from "@/external/prisma-generated";

export type PostWorkers = Post & {
  workers: Worker[];
}