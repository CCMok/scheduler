import ChildSettingLayout from '@/components/layout/setting/child-setting-layout';
import { PATH } from '@/libs/share/_general/utils/path';
import { DepartmentParam } from '@/app/(private)/setting/departments/_components/department-param';

type Props = {
  orgId: number;
}

export default async function DepartmentsSection({
  orgId,
}: Readonly<Props>) {
  return (
    <ChildSettingLayout
      childName="部門"
      href={`${PATH.setting.departments}?${DepartmentParam.ORGANIZATION_ID}=${orgId}`}
    />
  )
}