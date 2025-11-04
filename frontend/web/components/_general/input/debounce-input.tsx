'use client'

import { ChangeEventHandler, ComponentProps } from "react";
import CustomInput from "./custom-input";
import { useDebouncedCallback } from "use-debounce";
import { DEFAULT_DEBOUNCE_MS } from "@/libs/_general/constants/debounce-constant";

type Props = ComponentProps<typeof CustomInput> & {
  debounceMs?: number;
};

export default function DebounceInput({
  onChange,
  value,
  defaultValue,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  ...props
}: Readonly<Props>) {
  const debounced = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    onChange?.(e)
  }, debounceMs);

  return (
    <CustomInput
      defaultValue={defaultValue ?? value} // do not pass as value, because value will be updated by debounced
      onChange={debounced}
      {...props}
    />
  )
}