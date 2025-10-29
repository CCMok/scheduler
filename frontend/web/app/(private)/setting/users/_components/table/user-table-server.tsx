import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UserTable from "./user-table";
import { getUsersRoleService } from "@/libs/server/user/services/get-users-role-service";
import { UserExcludePasswordRole } from "@/libs/server/user/models/user-dao";

const getUsers = async (): Promise<UserExcludePasswordRole[]> => {
  return await fetchData(
    async () => await getUsersRoleService({
      orderBys: [{ field: 'email' }],
    }),
    path => redirect(path),
    [],
  )
}

export default async function UserTableServer() {
  const users = await getUsers();
  return (
    <UserTable
      users={users}
    />
  )
}
