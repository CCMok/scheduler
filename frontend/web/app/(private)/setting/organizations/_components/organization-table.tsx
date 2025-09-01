'use client'

import { Organization } from "@/external/prisma-generated";
import { useMemo } from "react";
import CustomTable from "@/components/table/custom-table";
import { columns, OrganizationTableId } from "./organization-table-column";
import { useSearchParams } from "next/navigation";
import { Param } from "@/libs/share/_general/enums/param";
import useTable from "@/components/table/use-table";

type Props = {
  organizations: Organization[];
}

export default function OrganizationTable({
  organizations,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const id = searchParams.get(Param.ID);

  const filteredOrganizations = useMemo(() => {
    return id ? organizations.filter(organization => organization.id.toString() === id) : organizations;
  }, [id, organizations])

  const table = useTable({
    data: filteredOrganizations,
    columns,
    defaultSorting: [{
      id: OrganizationTableId.NAME,
      desc: false,
    }],
  })

  return (
    <CustomTable table={table} />
  )
}