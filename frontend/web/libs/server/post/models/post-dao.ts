import { Post } from "@/external/prisma-generated";
import { Count } from "../../_general/models/count";

export type PostWorkersCount = Post & Count<{
  postWorkers: number;
}>