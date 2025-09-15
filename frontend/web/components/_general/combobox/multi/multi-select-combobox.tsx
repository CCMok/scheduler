'use client'

import { Popover, } from "@/external/shadcn/components/ui/popover";
import { useCallback, useMemo, useState } from "react";
import MultiSelectComboboxTrigger from "./trigger/multi-select-combobox-trigger";
import { MultiSelectComboboxContext, MultiSelectComboboxContextState } from "./multi-select-combobox-context";
import { TriggerBadgeVariant } from "./trigger/badge/trigger-badge";
import MultiSelectComboboxContent from "./content/multi-select-combobox-content";
import { MAX_DISPLAY_COUNT } from "@/libs/client/_general/constants/display-constant";

type Props<T> = {
  values: string[];
  onValueChange: (value: string[]) => void;
  options: T[];
  getValue: (option: T) => string;
  getDisplayName: (option: T) => string;
  maxDisplayCount?: number;
  badgeVariant?: TriggerBadgeVariant['variant'];
}

export default function MultiSelectCombobox<T>({
  values,
  onValueChange,
  options,
  getValue,
  getDisplayName,
  maxDisplayCount = MAX_DISPLAY_COUNT,
  badgeVariant,
}: Readonly<Props<T>>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onToggleOption = useCallback((optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter(value => value !== optionValue)
      : [...values, optionValue];
    onValueChange(newValues);
  }, [values, onValueChange]);

  // Context instead of zustand store, for simplicity of sharing value by parent props
  const contextValue: MultiSelectComboboxContextState<T> = useMemo(() => ({
    values,
    onValueChange,
    options,
    getValue,
    getDisplayName,
    maxDisplayCount,
    badgeVariant,
    onToggleOption,
    setIsPopoverOpen,
  }), [
    values,
    onValueChange,
    options,
    getValue,
    getDisplayName,
    maxDisplayCount,
    badgeVariant,
    onToggleOption,
  ]);

  return (
    <MultiSelectComboboxContext.Provider value={contextValue}>
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <MultiSelectComboboxTrigger />
        <MultiSelectComboboxContent />
      </Popover>
    </MultiSelectComboboxContext.Provider>
  );
};