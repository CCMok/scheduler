import { Post, Worker } from "@/external/prisma/generated/client";

export type PostWorker = Post & {
  workers: Worker[];
}