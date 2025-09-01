'use client'

import ComboBox from "@/components/combobox/combo-box";
import { Organization } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { useMemo } from "react";
import { DepartmentParam } from "./department-param";
import { PATH } from "@/libs/share/_general/utils/path";
import QueryInputWrapper from "@/components/input/query-input-wrapper";

type Props = {
  organizations: Organization[];
}

export default function OrganizationComboBox({
  organizations,
}: Readonly<Props>) {
  const options = useMemo(() => {
    return [{ id: '', name: '(未選擇)' }, ...organizations]
  }, [organizations])

  return (
    <div className='space-y-2'>
      <Label>組織</Label>
      <QueryInputWrapper
        render={(id, onValueChange) => (
          <ComboBox
            value={id}
            options={options}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={onValueChange}
          />
        )}
        paramName={DepartmentParam.ORGANIZATION_ID}
        path={PATH.setting.departments}
      />
    </div>
  )
}