import { Post, RosterHistory, RosterHistorySchedule, RosterHistoryScheduleArrangement, Worker } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";
import { UserExcludePassword } from "../../user/models/user-dao";

export type RosterHistoryRelated = RosterHistory & {
  department: DepartmentOrganization;
  createdByUser: UserExcludePassword;
}

export type RosterHistoryScheduleArrangementRelated = RosterHistoryScheduleArrangement & {
  post: Post;
  worker: Worker | null;
}

export type RosterHistoryScheduleRelated = RosterHistorySchedule & {
  rosterHistoryScheduleArrangements: RosterHistoryScheduleArrangementRelated[];
}