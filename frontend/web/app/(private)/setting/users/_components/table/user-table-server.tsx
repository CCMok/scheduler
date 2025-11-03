import { redirect } from "next/navigation";
import UserTable from "./user-table";
import { getUsersWithRoleService } from "@/libs/server/user/services/get-users-with-role-service";
import { UserExcludePasswordWithRole } from "@/libs/server/user/models/user-dao";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getUsers = async (): Promise<UserExcludePasswordWithRole[]> => {
  const response = await getUsersWithRoleService()
  return handleGetResponse(response, redirect, [])
}

export default async function UserTableServer() {
  const users = await getUsers();
  return (
    <UserTable
      users={users}
    />
  )
}
