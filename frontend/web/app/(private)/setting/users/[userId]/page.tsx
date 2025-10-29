import { notFound } from "next/navigation";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import { PATH } from "@/libs/share/_general/utils/path";
import UserEmail from "@/components/user/user-email";
import UserBasicInfoSection from "./_components/basic-info/user-basic-info-section";
import UserOrganizationsSection from "./_components/organizations/user-organizations-section";

type Props = ParamProps<{ [Param.USER_ID]: string }>

export default async function UserSettingPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).userId;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  return (
    <QueryTabLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'users',
          label: '用戶',
          href: PATH.setting.users.base,
        },
        {
          key: 'user',
          label: <UserEmail id={id} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UserBasicInfoSection id={id} />,
        },
        {
          value: 'organizations',
          label: '機構',
          content: <UserOrganizationsSection id={id} />,
        },
      ]}
    />
  )
}