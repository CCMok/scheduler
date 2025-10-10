import CustomButton from '@/components/_general/button/custom-button';
import CustomLink from '@/components/_general/link/custom-link';
import { PATH } from '@/libs/share/_general/utils/path';
import { Plus } from 'lucide-react';

export default function CreateOrganizationButton() {
  return (
    <CustomButton asChild>
      <CustomLink href={PATH.setting.organizations.new}>
        <Plus />
        新增
      </CustomLink>
    </CustomButton>
  )
}