import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import { PATH } from "@/libs/share/_general/utils/path";
import CreateDepartmentForm from "./_components/form/create-department-form";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound } from "next/navigation";
import OrganizationName from "@/components/organization/organization-name";

type Props = ParamProps<{ [Param.ORG_ID]: string }>

export default async function DepartmentNewPage({
  params,
}: Readonly<Props>) {  
  const paramId = (await params).orgId;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'organizations',
          label: '組織',
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
      <CreateDepartmentForm />
    </SidebarInsetLayout>
  )
}