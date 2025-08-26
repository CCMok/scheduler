'use client';

import CustomButton from "@/components/button/custom-button";
import { ArrowDownUp } from "lucide-react";
import { isNil } from "lodash";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { PATH } from "@/libs/share/_general/utils/path";
import CustomLink from "@/components/link/custom-link";

export default function UpdatePostSequenceButton() {
  const departmentId = usePostSettingStore(state => state.departmentId);

  return (
    <CustomButton
      size='sm'
      asChild
    >
      <CustomLink
        href={PATH.setting.department.post.sequence.build(departmentId ?? 0)}
        isDisabled={isNil(departmentId)}
      >
        <ArrowDownUp />
        更新順序
      </CustomLink>
    </CustomButton>
  );
} 