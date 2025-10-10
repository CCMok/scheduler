'use client'

import { useParams } from "next/navigation";
import { Param } from '@/libs/share/_general/enums/param';
import CustomButton from '@/components/_general/button/custom-button';
import CustomLink from '@/components/_general/link/custom-link';
import { Plus } from 'lucide-react';
import { PATH } from '@/libs/share/_general/utils/path';

export default function CreateDepartmentButton() {
  const params = useParams();
  const orgId = Number(params[Param.ORG_ID]);

  if (isNaN(orgId)) {
    console.error(`orgId is not found. orgId: ${orgId}`)
    return <></>
  }

  return (
    <CustomButton asChild>
      <CustomLink href={PATH.setting.organizations.departments.new(orgId)}>
        <Plus />
        新增
      </CustomLink>
    </CustomButton>
  )
}