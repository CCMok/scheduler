'use client'

import { Organization } from "@/external/prisma-generated";
import { useEffect } from "react";
import { columns, UserOrganizationTableId } from "./user-organization-table-column";
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import { Param } from "@/libs/share/_general/enums/param";
import CustomTable from "@/components/_general/table/custom-table";

type Props = {
  organizations: Organization[];
}

export default function UserOrganizationTable({
  organizations,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  const table = useTable({
    data: organizations,
    columns,
    defaultSorting: [{
      id: UserOrganizationTableId.NAME,
      desc: false,
    }],
    defaultColumnFilters: [
      ...(name ? [{ id: UserOrganizationTableId.NAME, value: name }] : []),
    ],
  })

  useEffect(() => {
    table.getColumn(UserOrganizationTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable
      table={table}
    />
  )
}