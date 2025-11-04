import { Post } from "@/external/prisma-generated";
import { Count } from "../../_general/models/count";

export type PostWithPostWorkersCount = Post & Count<{
  postWorkers: number;
}>