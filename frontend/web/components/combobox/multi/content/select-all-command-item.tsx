'use client'

import { cn } from "@/external/shadcn/libs/utils";
import { CheckIcon } from "lucide-react";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import { CommandItem } from "@/external/shadcn/components/ui/command";

export default function SelectAllCommandItem<T>() {
  const {
    values,
    onValueChange,
    options,
    getValue,
  } = useMultiSelectComboboxContext<T>();

  const onSelect = () => {
    if (values.length === options.length) {
      onValueChange([])
      return
    }

    const allValues = options.map(getValue);
    onValueChange(allValues);
  };

  return (
    <CommandItem
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <div className={cn(
        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
        values.length === options.length && options.length > 0
          ? "bg-primary text-primary-foreground"
          : "opacity-50 [&_svg]:invisible"
      )}>
        <CheckIcon className="h-4 w-4" />
      </div>
      <span>(選擇全部)</span>
    </CommandItem>
  )
}