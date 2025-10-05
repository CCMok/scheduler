'use client'

import { useEffect } from "react";
import { getColumns, UserTableId } from "./user-table-column";
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import { Param } from "@/libs/share/_general/enums/param";
import CustomTable from "@/components/_general/table/custom-table";
import { UserExcludePasswordRole } from "@/libs/server/user/models/user-dao";

type Props = {
  users: UserExcludePasswordRole[];
}

export default function UserTable({
  users,
}: Readonly<Props>) {
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
      {
        id: UserTableId.EMAIL,
        value: email ?? '',
      },
      {
        id: UserTableId.NAME,
        value: name ?? '',
      },
      {
        id: UserTableId.ROLE_NAME,
        value: roleName ?? '',
      }
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