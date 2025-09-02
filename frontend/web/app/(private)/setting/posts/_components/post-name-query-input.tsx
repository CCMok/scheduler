'use client'

import LabelInput from "@/components/input/label-input";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { PostParam } from "./post-param";
import { PATH } from "@/libs/share/_general/utils/path";
import DebounceInput from "@/components/input/debounce-input";

export default function PostNameQueryInput() {
  return (
    <LabelInput label="職位名稱">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <DebounceInput
            value={value}
            onChange={e => onValueChange(e.target.value)}
          />
        )}
        paramName={PostParam.NAME}
        path={PATH.setting.posts}
      />
    </LabelInput>
  )
}