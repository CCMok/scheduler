'use client'

import ComboBox from "@/components/combobox/combo-box";
import LabelInput from "@/components/input/label-input";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { Department } from "@/external/prisma-generated";
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
    <LabelInput label="部門">
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
    </LabelInput>
  )
}