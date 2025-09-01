'use client'

import ComboBox from "@/components/combobox/combo-box";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { Organization } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { DEFAULT_ORGANIZATION_OPTION } from "@/libs/server/organization/models/organization-dao";
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
    <div className='space-y-2'>
      <Label>組織</Label>
      <QueryInputWrapper
        render={(id, onValueChange) => (
          <ComboBox
            value={id ?? ''}
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