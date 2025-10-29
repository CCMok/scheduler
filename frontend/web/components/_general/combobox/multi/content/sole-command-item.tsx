'use client'

import { CommandItem } from "@/external/shadcn/components/ui/command";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import { cn } from "@/external/shadcn/libs/utils";
import { CheckIcon } from "lucide-react";

type props<T> = {
  option: T;
}

export default function SoleCommandItem<T>({
  option,
}: Readonly<props<T>>) {
  const {
    values,
    getValue,
    getDisplayName,
    onToggleOption,
  } = useMultiSelectComboboxContext<T>();

  const isSelected = values.includes(getValue(option));

  return (
    <CommandItem
      onSelect={() => onToggleOption(getValue(option))}
      className="cursor-pointer"
    >
      <div
        className={cn(
          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "opacity-50 [&_svg]:invisible"
        )}
      >
        <CheckIcon className="h-4 w-4 text-primary-foreground" />
      </div>
      <span>{getDisplayName(option)}</span>
    </CommandItem>
  )
}