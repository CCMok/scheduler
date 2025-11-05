'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/external/shadcn/components/ui/command"
import { FormControl } from "@/external/shadcn/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { Check } from "lucide-react"
import { Key, useMemo, useState } from "react"
import CustomCommandItem from "../command/custom-command-item"
import ComboBoxTriggerButton from "./combo-box-trigger-button"
import { isNil } from "lodash"

type Props<T, V extends Key> = {
  value: V | undefined,
  onValueChange: (value: V | undefined) => void,
  options: T[],
  getValue: (option: T) => V,
  getDisplayName: (option: T) => string,
  isFormField?: boolean,
  defaultIsOpen?: boolean,
  avoidCollisions?: boolean,
  isOptional?: boolean,
}

export default function ComboBox<T, V extends Key>({
  value,
  onValueChange,
  options,
  getValue,
  getDisplayName,
  isFormField = false,
  defaultIsOpen = false,
  avoidCollisions = true,
  isOptional = true,
}: Readonly<Props<T, V>>) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)

  const selectedItemDisplay = useMemo(() => {
    if (isNil(value) || value === '') return '選擇';
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
                      if (isOptional) {
                        if (value === itemValue) {
                          onValueChange(undefined)
                        } else {
                          onValueChange(itemValue)
                        }
                      } else if (value !== itemValue) {
                        onValueChange(itemValue)
                      }

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