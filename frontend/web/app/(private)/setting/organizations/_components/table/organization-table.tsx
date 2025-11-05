'use client'

import { Organization } from "@/external/prisma-generated";
import { use, useEffect } from "react";
import { getColumns, OrganizationTableId } from "./organization-table-column";
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import { Param } from "@/libs/_general/enums/param";
import { Role } from "@/libs/role/enums/role";
import CustomTable from "@/components/_general/table/custom-table";

type Props = {
  rolePromise: Promise<Role | undefined>;
  organizationsPromise: Promise<Organization[]>;
}

export default function OrganizationTable({
  rolePromise,
  organizationsPromise,
}: Readonly<Props>) {
  const role = use(rolePromise);
  const organizations = use(organizationsPromise);

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
    defaultColumnFilters: [
      ...(name ? [{ id: OrganizationTableId.NAME, value: name }] : []),
    ],
  })

  useEffect(() => {
    table.getColumn(OrganizationTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable
      table={table}
    />
  )
}