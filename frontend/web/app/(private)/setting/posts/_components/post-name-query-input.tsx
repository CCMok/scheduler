'use client'

import CustomInput from "@/components/input/custom-input";
import LabelInput from "@/components/input/label-input";
import QueryInputWrapper from "@/components/input/query-input-wrapper";
import { PostParam } from "./post-param";
import { PATH } from "@/libs/share/_general/utils/path";

export default function PostNameQueryInput() {
  return (
    <LabelInput label="職位名稱">
      <QueryInputWrapper
        render={(value, onValueChange) => (
          <CustomInput
            defaultValue={value}
            onChange={e => onValueChange(e.currentTarget.value)}
          />
        )}
        paramName={PostParam.NAME}
        path={PATH.setting.posts}
        debounceMs={500}
      />
    </LabelInput>
  )
}