'use client'

import { Badge } from "@/external/shadcn/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/external/shadcn/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { CheckIcon, ChevronDown } from "lucide-react"
import { Key, ReactNode, useState } from "react"
import CustomButton from "../button/custom-button"

export default function MultipleCombobox<T, V extends Key>({
  id,
  value,
  setValue,
  options,
  getOptionValue,
  getOptionDisplay,
  placeHolder,
  icon,
  defaultIsOpen = false,
}: Readonly<{
  id?: string;
  value: V[];
  setValue: (value: V[]) => void;
  options: T[];
  getOptionValue: (option: T) => V;
  getOptionDisplay: (option: T) => string;
  placeHolder?: string;
  icon?: ReactNode;
  defaultIsOpen?: boolean;
}>) {
  const [open, setOpen] = useState(defaultIsOpen)
  const selectedItems = options.filter((option) => (
    value.includes(getOptionValue(option))
  ))

  const toggleOption = (option: T) => {
    const selectedValue = getOptionValue(option)
    const nextValue = value.includes(selectedValue)
      ? value.filter((itemValue) => itemValue !== selectedValue)
      : [...value, selectedValue]

    setValue(nextValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CustomButton
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-h-9 h-auto w-(--input-width)"
        >
          {icon}
          {selectedItems.length > 0 ? (
            <span className="flex min-w-0 flex-1 flex-wrap gap-1">
              {selectedItems.map((selectedItem) => (
                <Badge
                  key={getOptionValue(selectedItem)}
                  variant="secondary"
                  className="max-w-full"
                >
                  <span className="truncate">{getOptionDisplay(selectedItem)}</span>
                </Badge>
              ))}
            </span>
          ) : (
            <span className="truncate text-muted-foreground">
              {placeHolder}
            </span>
          )}
          <ChevronDown className="ml-auto" />
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜尋..." />
          <CommandList>
            <CommandEmpty>沒有資料</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValue = getOptionValue(option)
                const isSelected = value.includes(optionValue)

                return (
                  <CommandItem
                    key={optionValue}
                    value={getOptionDisplay(option)}
                    onSelect={() => toggleOption(option)}
                  >
                    {icon}
                    <span className="truncate">{getOptionDisplay(option)}</span>
                    {isSelected && (
                      <CheckIcon className="ml-auto" />
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
