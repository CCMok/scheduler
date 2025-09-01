import { WorkerParam } from '@/app/(private)/setting/workers/_components/worker-param';
import ChildSettingLayout from '@/components/layout/setting/child-setting-layout';
import { PATH } from '@/libs/share/_general/utils/path';

type Props = {
  departmentId: number;
}

export default function WorkersSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <ChildSettingLayout
      childName="員工"
      href={`${PATH.setting.workers}?${WorkerParam.DEPARTMENT_ID}=${departmentId}`}
    />
  )
}