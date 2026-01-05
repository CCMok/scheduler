'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/external/shadcn/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { useState } from "react"
import CustomButton from "../button/custom-button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/external/shadcn/libs/utils"

export default function Combobox({
  placeHolder,
  value,
}: Readonly<{
  placeHolder?: string;
  value?: string;
}>) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CustomButton
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-(--input-width)"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ?? placeHolder}
          </span>
          <ChevronDown className='ml-auto' />
        </CustomButton>
        {/* <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {/* {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))} */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}