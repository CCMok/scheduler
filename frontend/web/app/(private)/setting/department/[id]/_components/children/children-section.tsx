import { PostParam } from '@/app/(private)/setting/posts/_components/post-param';
import ChildSettingLayout from '@/components/layout/setting/child-setting-layout';
import { PATH } from '@/libs/share/_general/utils/path';

type Props = {
  departmentId: number;
}

export default function ChildrenSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <ChildSettingLayout
      entityName="部門"
      childrenManage={[
        {
          name: '職位',
          href: `${PATH.setting.posts}?${PostParam.DEPARTMENT_ID}=${departmentId}`,
        },
        {
          name: '值班表職位順序',
          href: PATH.setting.department.posts.sequence.build(departmentId),
        },
        {
          name: '人員',
          href: `${PATH.setting.workers}?${PostParam.DEPARTMENT_ID}=${departmentId}`,
        },
      ]}
    />
  )
}