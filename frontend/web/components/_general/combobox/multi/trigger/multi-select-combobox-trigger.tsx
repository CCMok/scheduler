'use client'

import { cn } from "@/external/shadcn/libs/utils";
import { PopoverTrigger } from "@/external/shadcn/components/ui/popover";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import TriggerEmptyDisplay from "./trigger-empty-display";
import TriggerValueDisplay from "./trigger-value-display";
import PlainButton from "@/components/_general/button/plain-button";

export default function MultiSelectComboboxTrigger<T>() {
  const {
    values,
  } = useMultiSelectComboboxContext<T>();

  return (
    <PopoverTrigger asChild>
      <PlainButton
        role='combobox'
        className={cn("flex w-(--input-width) p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto min-w-(--input-width)")}
      >
        {values.length
          ? <TriggerValueDisplay />
          : <TriggerEmptyDisplay />
        }
      </PlainButton>
    </PopoverTrigger>
  )
}