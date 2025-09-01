import { PostParam } from '@/app/(private)/setting/posts/_components/post-param';
import ChildSettingLayout from '@/components/layout/setting/child-setting-layout';
import { PATH } from '@/libs/share/_general/utils/path';

type Props = {
  departmentId: number;
}

export default function PostsSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <ChildSettingLayout
      childName="職位"
      href={`${PATH.setting.posts}?${PostParam.DEPARTMENT_ID}=${departmentId}`}
    />
  )
}