'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/external/shadcn/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { Key, ReactNode, useState } from "react"
import CustomButton from "../button/custom-button"
import { CheckIcon, ChevronDown } from "lucide-react"
import { cn } from "@/external/shadcn/libs/utils"

export default function Combobox<T, V extends Key>({
  value,
  setValue,
  options,
  getOptionValue,
  getOptionDisplay,
  isOptional = false,
  placeHolder,
  icon,
}: Readonly<{
  value: V | undefined;
  setValue: (value: V | undefined) => void;
  options: T[];
  getOptionValue: (option: T) => V;
  getOptionDisplay: (option: T) => string;
  isOptional?: boolean;
  placeHolder?: string;
  icon?: ReactNode;
}>) {
  const [open, setOpen] = useState(false)
  const selectedItem = options.find((option) => getOptionValue(option) === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CustomButton
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-(--input-width)"
        >
          {icon}
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedItem
              ? getOptionDisplay(selectedItem)
              : placeHolder
            }
          </span>
          <ChevronDown className='ml-auto' />
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜尋..." />
          <CommandList>
            <CommandEmpty>沒有資料</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionDisplay(option)}
                  onSelect={() => {
                    const selectValue = getOptionValue(option)
                    setValue(isOptional && selectValue === value ? undefined : selectValue)
                    setOpen(false)
                  }}
                >
                  {icon}
                  <span className="truncate">{getOptionDisplay(option)}</span>
                  {value === getOptionValue(option) && (
                    <CheckIcon className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}