import { SearchParamsProps } from "@/libs/share/_general/props/param-props";
import ManageDepartmentsSection from "./_components/manage-departments-section";
import { DepartmentParam } from "./_components/department-param";

export default async function DepartmentsPage({
  searchParams,
}: SearchParamsProps<{ [DepartmentParam.ORGANIZATION_ID]: string | undefined }>) {
  const paramId = (await searchParams).organizationId;
  const orgId = paramId ? Number(paramId) : undefined

  return (
    <ManageDepartmentsSection orgId={orgId} />
  )
}