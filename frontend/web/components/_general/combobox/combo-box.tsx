'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/external/shadcn/components/ui/command"
import { FormControl } from "@/external/shadcn/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { Check } from "lucide-react"
import { useMemo, useState } from "react"
import CustomCommandItem from "../command/custom-command-item"
import ComboBoxTriggerButton from "./combo-box-trigger-button"

type Props<T> = {
  value: string,
  onValueChange: (value: string) => void,
  options: T[],
  getValue: (option: T) => string,
  getDisplayName: (option: T) => string,
  isFormField?: boolean,
  defaultIsOpen?: boolean,
  avoidCollisions?: boolean,
}

export default function ComboBox<T>({
  value,
  onValueChange,
  options,
  getValue,
  getDisplayName,
  isFormField = false,
  defaultIsOpen = false,
  avoidCollisions = true,
}: Readonly<Props<T>>) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)

  const selectedItemDisplay = useMemo(() => {
    if (!value) return '選擇';
    const option = options.find(option => getValue(option) === value)
    return option ? getDisplayName(option) : '';
  }, [value, options, getValue, getDisplayName])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {isFormField ?
          <FormControl>
            <ComboBoxTriggerButton
              value={value}
              display={selectedItemDisplay}
            />
          </FormControl>
          :
          <ComboBoxTriggerButton
            value={value}
            display={selectedItemDisplay}
          />
        }
      </PopoverTrigger>
      <PopoverContent className="w-(--input-width) p-0" data-popover-content avoidCollisions={avoidCollisions}>
        <Command>
          <CommandInput
            placeholder="搜尋..."
            className='h-9'
          />
          <CommandList>
            <CommandEmpty>沒有資料</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const itemValue = getValue(option)
                const displayName = getDisplayName(option)

                return (
                  <CustomCommandItem
                    key={itemValue}
                    value={displayName}
                    onSelect={() => {
                      onValueChange(value === itemValue ? '' : itemValue)
                      setIsOpen(false)
                    }}
                  >
                    {displayName}
                    <Check
                      className={cn(
                        "ml-auto",
                        itemValue !== value && "opacity-0",
                      )}
                    />
                  </CustomCommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}