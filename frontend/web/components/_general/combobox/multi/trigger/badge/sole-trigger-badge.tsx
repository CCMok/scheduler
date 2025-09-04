'use client'

import { XCircle } from "lucide-react";
import { useMultiSelectComboboxContext } from "../../multi-select-combobox-context";
import TriggerBadge from "./trigger-badge";

type Props = {
  value: string;
}

export default function SoleTriggerBadge<T>({
  value,
}: Readonly<Props>) {
  const {
    options,
    getValue,
    getDisplayName,
    onToggleOption,
  } = useMultiSelectComboboxContext<T>();

  const option = options.find(option => getValue(option) === value);

  return (
    <TriggerBadge>
      {option && getDisplayName(option)}
      <span
        role='button'
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.stopPropagation();
            onToggleOption(value);
          }
        }}
        onClick={event => {
          event.stopPropagation();
          onToggleOption(value);
        }}
      >
        <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
      </span>
    </TriggerBadge>
  )
}