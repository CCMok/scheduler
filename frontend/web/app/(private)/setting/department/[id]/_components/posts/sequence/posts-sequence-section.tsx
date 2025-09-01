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
      childName="值班表職位順序"
      href={PATH.setting.department.posts.sequence.build(departmentId)}
    />
  )
}