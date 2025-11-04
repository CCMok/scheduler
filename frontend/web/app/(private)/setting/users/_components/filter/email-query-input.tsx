'use client'

import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import DebounceInput from '@/components/_general/input/debounce-input';
import { DEFAULT_SEARCH_PLACEHOLDER } from "@/libs/_general/constants/input-constant";
import { Param } from '@/libs/_general/enums/param';

export default function EmailQueryInput() {
  return (
    <LabelInput label="電郵地址">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <DebounceInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder={DEFAULT_SEARCH_PLACEHOLDER}
          />
        )}
        paramName={Param.EMAIL}
      />
    </LabelInput>
  )
}