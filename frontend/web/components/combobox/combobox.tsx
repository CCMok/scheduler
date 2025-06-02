'use client'

import { Button } from "@/external/shadcn/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/external/shadcn/components/ui/command"
import { FormControl } from "@/external/shadcn/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { Check, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import CustomCommandItem from "../command/custom-command-item"

type Props<T> = {
  value: string,
  onValueChange: (value: string) => void,
  options: T[],
  getValue: (option: T) => string,
  getDisplayName: (option: T) => string,
}

export default function ComboBox<T>({
  value,
  onValueChange,
  options,
  getValue,
  getDisplayName,
}: Readonly<Props<T>>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedItemDisplay = useMemo(() => {
    if (!value) return '選擇';
    const option = options.find(option => getValue(option) === value)
    return option ? getDisplayName(option) : '';
  }, [value, options, getValue, getDisplayName])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='comobox'
            className={cn(
              "w-(--input-width) justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {selectedItemDisplay}
            <ChevronDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-(--input-width) p-0">
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
                      onValueChange(itemValue)
                      setIsOpen(false)
                    }}
                  >
                    {displayName}
                    <Check
                      className={cn(
                        "ml-auto",
                        itemValue === value
                          ? "opacity-100"
                          : "opacity-0"
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