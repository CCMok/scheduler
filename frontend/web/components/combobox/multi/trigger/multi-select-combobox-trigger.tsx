'use client'

import { cn } from "@/external/shadcn/libs/utils";
import { Button } from "@/external/shadcn/components/ui/button";
import { FormControl } from "@/external/shadcn/components/ui/form";
import { PopoverTrigger } from "@/external/shadcn/components/ui/popover";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import TriggerEmptyDisplay from "./trigger-empty-display";
import TriggerValueDisplay from "./trigger-value-display";

export default function MultiSelectComboboxTrigger<T>() {
  const {
    values,
  } = useMultiSelectComboboxContext<T>();

  return (
    <PopoverTrigger asChild>
      <FormControl>
        <Button
          role='combobox'
          className={cn("flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto min-w-(--input-width)")}
        >
          {values.length
            ? <TriggerValueDisplay />
            : <TriggerEmptyDisplay />
          }
        </Button>
      </FormControl>
    </PopoverTrigger>
  )
}