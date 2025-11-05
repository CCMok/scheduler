'use client'

import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import { Param } from '@/libs/_general/enums/param';
import ComboBox from '@/components/_general/combobox/combo-box';
import { Role } from '@/external/prisma-generated';
import { use } from 'react';

type Props = {
  rolesPromise: Promise<Role[]>;
}

export default function RoleIdQueryInput({
  rolesPromise,
}: Readonly<Props>) {
  const roles = use(rolesPromise);

  return (
    <LabelInput label="權限">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <ComboBox
            value={value}
            options={roles}
            getValue={option => option.name}
            getDisplayName={option => option.name}
            onValueChange={value => onValueChange(value ?? '')}
          />
        )}
        paramName={Param.ROLE_NAME}
      />
    </LabelInput>
  )
}