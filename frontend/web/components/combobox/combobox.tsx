'use client'

import { Button } from "@/external/shadcn/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/external/shadcn/components/ui/command"
import { FormControl } from "@/external/shadcn/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { Check, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import CommandItemCustom from "../command/command-item-custom"
import { getSelectedItemDisplay } from "./combobox-utils"

type Props<T> = {
  value: string,
  items: T[],
  getValue: (item: T) => string,
  getDisplayName: (item: T) => string,
  onSelect: (value: string) => void,
}

export default function ComboBox<T>({
  value,
  items,
  getValue,
  getDisplayName,
  onSelect,
}: Readonly<Props<T>>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedItemDisplay = useMemo(() => getSelectedItemDisplay(
    value, items, getValue, getDisplayName
  ), [value, items, getValue, getDisplayName])

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
              {items.map(item => {
                const itemValue = getValue(item)
                const displayName = getDisplayName(item)

                return (
                  <CommandItemCustom
                    key={itemValue}
                    value={displayName}
                    onSelect={() => {
                      onSelect(itemValue)
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
                  </CommandItemCustom>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}