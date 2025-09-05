'use client'

import LabelInput from '@/components/_general/input/label-input';
import QueryInputWrapper from '@/components/_general/input/query-input-wrapper';
import { PostParam } from "./post-param";
import DebounceInput from '@/components/_general/input/debounce-input';
import { DEFAULT_SEARCH_PLACEHOLDER } from "@/libs/client/_general/constants/input-constant";

export default function PostNameQueryInput() {
  return (
    <LabelInput label="職位名稱">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <DebounceInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder={DEFAULT_SEARCH_PLACEHOLDER}
          />
        )}
        paramName={PostParam.NAME}
      />
    </LabelInput>
  )
}