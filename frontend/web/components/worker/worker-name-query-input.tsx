'use client'

import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import DebounceInput from '@/components/_general/input/debounce-input';
import { DEFAULT_SEARCH_PLACEHOLDER } from "@/libs/client/_general/constants/input-constant";
import { Param } from '@/libs/share/_general/enums/param';

export default function WorkerNameQueryInput() {
  return (
    <LabelInput label="人員名稱">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <DebounceInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder={DEFAULT_SEARCH_PLACEHOLDER}
          />
        )}
        paramName={Param.NAME}
      />
    </LabelInput>
  )
}