import { Post, RosterHistory, RosterHistoryOffWorker, RosterHistoryOffWorkerDay, RosterHistorySchedule, RosterHistoryScheduleArrangement, Worker } from "@/external/prisma-generated";
import { DepartmentWithOrganization } from "../../department/models/department-dao";
import { UserExcludePassword } from "../../user/models/user-dao";

export type RosterHistoryRelated = RosterHistory & {
  department: DepartmentWithOrganization;
  createdByUser: UserExcludePassword;
}

export type RosterHistoryScheduleArrangementRelated = RosterHistoryScheduleArrangement & {
  post: Post;
  worker: Worker | null;
}

export type RosterHistoryScheduleRelated = RosterHistorySchedule & {
  rosterHistoryScheduleArrangements: RosterHistoryScheduleArrangementRelated[];
}

export type RosterHistoryOffWorkerRelated = RosterHistoryOffWorker & {
  rosterHistoryOffWorkerDays: RosterHistoryOffWorkerDay[];
}