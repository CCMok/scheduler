import { SearchParamsProps } from "@/libs/share/_general/props/param-props";
import ManageDepartmentsSection from "./_components/manage-departments-section";
import { DepartmentParam } from "./_components/department-param";
import { Param } from "@/libs/share/_general/enums/param";

export default async function DepartmentsPage({
  searchParams,
}: SearchParamsProps<{
  [Param.ID]: string | undefined,
  [DepartmentParam.ORGANIZATION_ID]: string | undefined,
}>) {
  const params = await searchParams;

  const paramId = params.id;
  const id = paramId ? Number(paramId) : undefined;

  const paramOrgId = params.organizationId;
  const orgId = paramOrgId ? Number(paramOrgId) : undefined

  return (
    <ManageDepartmentsSection id={id} orgId={orgId} />
  )
}