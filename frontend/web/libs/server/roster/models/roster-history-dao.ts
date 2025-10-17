import { RosterHistory } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";
import { UserExcludePassword } from "../../user/models/user-dao";

export type RosterHistoryRelated = RosterHistory & {
  department: DepartmentOrganization;
  createdByUser: UserExcludePassword;
}