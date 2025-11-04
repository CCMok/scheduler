'use client'

import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import DebounceInput from '@/components/_general/input/debounce-input';
import { DEFAULT_SEARCH_PLACEHOLDER } from "@/libs/_general/constants/input-constant";
import { Param } from '@/libs/_general/enums/param';

type Props = {
  paramName?: string;
}

export default function DepartmentNameQueryInput({
  paramName = Param.NAME,
}: Readonly<Props>) {
  return (
    <LabelInput label="部門名稱">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <DebounceInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder={DEFAULT_SEARCH_PLACEHOLDER}
          />
        )}
        paramName={paramName}
      />
    </LabelInput>
  )
}