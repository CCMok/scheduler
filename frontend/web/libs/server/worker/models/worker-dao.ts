import { Worker } from "@/external/prisma-generated";
import { Count } from "../../_general/models/count";

export type WorkerWithPostWorkersCount = Worker & Count<{
  postWorkers: number;
}>