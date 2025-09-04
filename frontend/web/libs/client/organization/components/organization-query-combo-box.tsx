'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import { Organization } from "@/external/prisma-generated";
import { DEFAULT_ORGANIZATION_OPTION } from "@/libs/server/organization/models/organization-dao";
import { toNumber } from "@/libs/share/_general/utils/number";
import { isNil } from "lodash";
import { useMemo } from "react";

type Props = {
  organizations: Organization[];
  paramName: string;
  cascadeParamNames?: string[];
  path: string;
}

export default function OrganizationQueryComboBox({
  organizations,
  paramName,
  cascadeParamNames,
  path,
}: Readonly<Props>) {
  const options = useMemo(() => {
    return [DEFAULT_ORGANIZATION_OPTION, ...organizations]
  }, [organizations])

  return (
    <LabelInput label="組織">
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