import { Post, RosterHistory, RosterHistoryOffWorker, RosterHistoryOffWorkerDay, RosterHistorySchedule, RosterHistoryScheduleArrangement, Worker } from "@/external/prisma-generated";
import { DepartmentWithOrganization } from "../../department/models/department-dao";
import { UserExcludePassword } from "../../user/models/user-dao";

export type RosterHistoryWithRelated = RosterHistory & {
  department: DepartmentWithOrganization;
  createdByUser: UserExcludePassword;
}

export type RosterHistoryScheduleArrangementWithRelated = RosterHistoryScheduleArrangement & {
  post: Post;
  worker: Worker | null;
}

export type RosterHistoryScheduleWithRelated = RosterHistorySchedule & {
  rosterHistoryScheduleArrangements: RosterHistoryScheduleArrangementWithRelated[];
}

export type RosterHistoryOffWorkerWithDays = RosterHistoryOffWorker & {
  rosterHistoryOffWorkerDays: RosterHistoryOffWorkerDay[];
}