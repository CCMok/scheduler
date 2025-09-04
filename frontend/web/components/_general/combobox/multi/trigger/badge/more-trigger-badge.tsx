'use client'

import { XCircle } from "lucide-react";
import TriggerBadge from "./trigger-badge";
import { useMultiSelectComboboxContext } from "../../multi-select-combobox-context";

export default function MoreTriggerBadge<T>() {
  const {
    values,
    onValueChange,
    maxDisplayCount,
  } = useMultiSelectComboboxContext<T>();

  const onClearExtraValues = () => {
    const newValues = values.slice(0, maxDisplayCount);
    onValueChange(newValues);
  }

  return (
    <TriggerBadge className="bg-transparent text-foreground border-foreground/10 hover:bg-transparent}">
      {`+ ${values.length - maxDisplayCount} 更多`}
      <span
        role='button'
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.stopPropagation();
            onClearExtraValues();
          }
        }}
        onClick={event => {
          event.stopPropagation();
          onClearExtraValues();
        }}
      >
        <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
      </span>
    </TriggerBadge>
  )
}