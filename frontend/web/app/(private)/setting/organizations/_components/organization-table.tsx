'use client'

import { Organization } from "@/external/prisma-generated";
import { useEffect } from "react";
import CustomTable from "@/components/table/custom-table";
import { columns, OrganizationTableId } from "./organization-table-column";
import { useSearchParams } from "next/navigation";
import useTable from "@/components/table/use-table";
import { OrganizationParam } from "./organization-param";

type Props = {
  organizations: Organization[];
}

export default function OrganizationTable({
  organizations,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(OrganizationParam.NAME);

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
    <CustomTable table={table} />
  )
}