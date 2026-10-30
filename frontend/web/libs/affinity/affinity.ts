import { Post, Worker } from "@/external/prisma/generated/client";

export type PostAffinityGroup = {
  id: number;
  teamId: number;
  members: Post[];
};

export type WorkerAffinityGroup = {
  id: number;
  teamId: number;
  members: Worker[];
};
