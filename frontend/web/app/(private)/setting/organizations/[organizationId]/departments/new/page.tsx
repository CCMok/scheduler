import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import { PATH } from "@/libs/_general/enums/path";
import CreateDepartmentForm from "./_components/form/create-department-form";
import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";
import { notFound } from "next/navigation";
import OrganizationName from "@/components/organization/organization-name";

type Props = ParamProps<{ [Param.ORGANIZATION_ID]: string }>

export default async function DepartmentNewPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const id = Number.parseInt(awaitedParams[Param.ORGANIZATION_ID]);
  if (Number.isNaN(id)) notFound();

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'organizations',
          label: '機構',
          href: PATH.setting.organizations.base,
        },
        {
          key: 'organization',
          label: <OrganizationName id={id} failNotFound />,
          href: PATH.setting.organizations.build(id),
        },
        {
          key: 'department',
          label: '部門',
        },
      ]}
    >
      <CreateDepartmentForm organizationId={id} />
    </SidebarInsetLayout>
  )
}