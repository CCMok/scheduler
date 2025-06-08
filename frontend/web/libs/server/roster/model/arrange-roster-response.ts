import { Post, Worker } from "@/external/prisma-generated";

export type ArrangeRosterResponseNew = {
  schedules: ScheduleNew[];
}

export type ScheduleNew = {
  post: Post;
  arrangements: ArrangementNew[];
}

export type ArrangementNew = {
  day: number;
  worker: Worker | undefined;
}