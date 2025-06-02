'use client'

import { ChevronDown, XIcon } from "lucide-react";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import SoleTriggerBadge from "./badge/sole-trigger-badge";
import MoreTriggerBadge from "./badge/more-trigger-badge";

export default function TriggerValueDisplay<T>() {
  const {
    values,
    onValueChange,
    maxDisplayCount,
  } = useMultiSelectComboboxContext<T>();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-wrap items-center">
        {values.slice(0, maxDisplayCount).map(value =>
          <SoleTriggerBadge
            key={value}
            value={value}
          />
        )}
        {values.length > maxDisplayCount && (
          <MoreTriggerBadge />
        )}
      </div>
      <div className="flex items-center justify-between">
        <span
          role='button'
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.stopPropagation();
              onValueChange([]);
            }
          }}
          onClick={event => {
            event.stopPropagation();
            onValueChange([]);
          }}
        >
          <XIcon className="h-4 mx-2 cursor-pointer text-muted-foreground" />
        </span>
        <Separator
          orientation="vertical"
          className="flex min-h-6 h-full"
        />
        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
      </div>
    </div>
  )
}