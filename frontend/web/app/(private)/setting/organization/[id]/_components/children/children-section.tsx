import { PATH } from '@/libs/share/_general/utils/path';
import { DepartmentParam } from '@/app/(private)/setting/departments/_components/department-param';
import ChildSettingLayout from '@/components/layout/setting/child-setting-layout';

type Props = {
  orgId: number;
}

export default async function ChildrenSection({
  orgId,
}: Readonly<Props>) {
  return (
    <ChildSettingLayout
      entityName="組織"
      childrenManage={[{
        name: '部門',
        href: `${PATH.setting.departments}?${DepartmentParam.ORGANIZATION_ID}=${orgId}`,
      }]}
    />
  )
}