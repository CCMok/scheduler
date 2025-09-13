'use client'

import { Organization } from "@/external/prisma-generated";
import { ReactNode, useEffect } from "react";
import { getColumns, OrganizationTableId } from "./organization-table-column";
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import ButtonTable from "@/components/_general/table/button-table";
import { Param } from "@/libs/share/_general/enums/param";
import { Role } from "@/libs/share/_general/enums/role";
import { isNil } from "lodash";

type Props = {
  organizations: Organization[];
  button?: ReactNode;
  role?: Role;
}

export default function OrganizationTable({
  organizations,
  button,
  role,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  const columns = getColumns(role);

  const table = useTable({
    data: organizations,
    columns,
    defaultSorting: [{
      id: OrganizationTableId.NAME,
      desc: false,
    }],
    defaultColumnFilters: [{
      id: OrganizationTableId.NAME,
      value: name ?? '',
    }],
  })

  useEffect(() => {
    table.getColumn(OrganizationTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <ButtonTable
      table={table}
      button={button}
    />
  )
}