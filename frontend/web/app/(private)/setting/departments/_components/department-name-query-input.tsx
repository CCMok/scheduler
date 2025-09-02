'use client'

import LabelInput from "@/components/input/label-input";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { PATH } from "@/libs/share/_general/utils/path";
import { DepartmentParam } from "./department-param";
import DebounceInput from "@/components/input/debounce-input";
import { DEFAULT_SEARCH_PLACEHOLDER } from "@/libs/client/_general/constants/input-constant";

export default function DepartmentNameQueryInput() {
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
        paramName={DepartmentParam.NAME}
        path={PATH.setting.departments}
      />
    </LabelInput>
  )
}