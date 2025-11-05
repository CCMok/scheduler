'use client'

import { use, useEffect } from "react";
import { getColumns, UserTableId } from "./user-table-column";
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import { Param } from "@/libs/_general/enums/param";
import CustomTable from "@/components/_general/table/custom-table";
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";

type Props = {
  usersPromise: Promise<UserExcludePasswordWithRole[]>;
}

export default function UserTable({
  usersPromise,
}: Readonly<Props>) {
  const users = use(usersPromise);

  const searchParams = useSearchParams();
  const email = searchParams.get(Param.EMAIL);
  const name = searchParams.get(Param.NAME);
  const roleName = searchParams.get(Param.ROLE_NAME);

  const columns = getColumns();

  const table = useTable({
    data: users,
    columns,
    defaultSorting: [{
      id: UserTableId.EMAIL,
      desc: false,
    }],
    defaultColumnFilters: [
      ...(email ? [{ id: UserTableId.EMAIL, value: email }] : []),
      ...(name ? [{ id: UserTableId.NAME, value: name }] : []),
      ...(roleName ? [{ id: UserTableId.ROLE_NAME, value: roleName }] : []),
    ],
  })

  useEffect(() => {
    table.getColumn(UserTableId.EMAIL)?.setFilterValue(email);
    table.getColumn(UserTableId.NAME)?.setFilterValue(name);
    table.getColumn(UserTableId.ROLE_NAME)?.setFilterValue(roleName);
  }, [email, name, roleName, table])

  return (
    <CustomTable
      table={table}
    />
  )
}