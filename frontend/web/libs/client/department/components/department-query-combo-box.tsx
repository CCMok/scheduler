'use client'

import ComboBox from "@/components/combobox/combo-box";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { Department } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { DEFAULT_DEPARTMENT_OPTION } from "@/libs/server/department/models/department-dao";
import { toNumber } from "@/libs/share/_general/utils/number";
import { isNil } from "lodash";
import { useMemo } from "react";

type Props = {
  departments: Department[];
  paramName: string;
  cascadeParamNames?: string[];
  path: string;
}

export default function DepartmentQueryComboBox({
  departments,
  paramName,
  cascadeParamNames,
  path,
}: Readonly<Props>) {
  const options = useMemo(() => {
    return [DEFAULT_DEPARTMENT_OPTION, ...departments]
  }, [departments])

  return (
    <div className='space-y-2'>
      <Label>部門</Label>
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <ComboBox
            value={isNil(toNumber(value)) ? '' : value}
            options={options}
            getValue={option => option.id?.toString() ?? ''}
            getDisplayName={option => option.name}
            onValueChange={onValueChange}
          />
        )}
        paramName={paramName}
        cascadeParamNames={cascadeParamNames}
        path={path}
      />
    </div>
  )
}