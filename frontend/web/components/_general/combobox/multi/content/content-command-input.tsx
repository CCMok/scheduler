'use client';

import { CommandInput } from "@/external/shadcn/components/ui/command";
import type { KeyboardEvent } from "react";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";

export default function ContentCommandInput<T>() {
  const {
    values,
    onValueChange,
  } = useMultiSelectComboboxContext<T>();

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return;
    }

    if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...values];
      newSelectedValues.pop();
      onValueChange(newSelectedValues);
    }
  };

  return (
    <CommandInput
      placeholder="搜尋..."
      onKeyDown={onKeyDown}
    />
  )
}