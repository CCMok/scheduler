import CustomButton from '@/components/_general/button/custom-button';
import CustomLink from '@/components/_general/link/custom-link';
import { Plus } from 'lucide-react';
import { PATH } from '@/libs/_general/enums/path';

type Props = {
  organizationId: number;
}

export default function CreateDepartmentButton({
  organizationId,
}: Readonly<Props>) {
  return (
    <CustomButton asChild>
      <CustomLink href={PATH.setting.organizations.departments.new(organizationId)}>
        <Plus />
        新增
      </CustomLink>
    </CustomButton>
  )
}