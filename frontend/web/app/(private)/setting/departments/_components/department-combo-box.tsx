'use client'

import ComboBox from "@/components/combobox/combo-box";
import { Department } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { useMemo } from "react";
import { PATH } from "@/libs/share/_general/utils/path";
import { Param } from "@/libs/share/_general/enums/param";
import QueryInputWrapper from "@/components/input/query-input-wrapper";

type Props = {
  departments: Department[];
}

export default function DepartmentComboBox({
  departments,
}: Readonly<Props>) {
  const options = useMemo(() => {
    return [{ id: '', name: '(未選擇)' }, ...departments]
  }, [departments])

  return (
    <div className='space-y-2'>
      <Label>部門</Label>
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
        paramName={Param.ID}
        path={PATH.setting.departments}
      />
    </div>
  )
}