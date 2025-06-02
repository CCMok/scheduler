'use client';

import { CommandItem } from "@/external/shadcn/components/ui/command";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import { Separator } from "@/external/shadcn/components/ui/separator";

export default function ClearCommandItem<T>() {
  const {
    onValueChange,
  } = useMultiSelectComboboxContext<T>();

  return (
    <>
      <CommandItem
        onSelect={() => onValueChange([])}
        className="flex-1 justify-center cursor-pointer"
      >
        清除
      </CommandItem>
      <Separator
        orientation="vertical"
        className="flex min-h-6 h-full"
      />
    </>
  )
}