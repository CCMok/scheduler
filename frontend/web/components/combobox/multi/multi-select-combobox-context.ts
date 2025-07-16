import { createContext, useContext } from "react";
import { TriggerBadgeVariant } from "./trigger/badge/trigger-badge";

export interface MultiSelectComboboxContextState<T = object> {
  values: string[];
  onValueChange: (value: string[]) => void;
  options: T[];
  getValue: (option: T) => string;
  getDisplayName: (option: T) => string;
  maxDisplayCount: number;
  badgeVariant?: TriggerBadgeVariant['variant'];
  onToggleOption: (value: string) => void;
  setIsPopoverOpen: (isOpen: boolean) => void;
}

// Using 'any' as a default for the generic type in createContext. The actual type safety is enforced by the Provider and the consumer hook.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MultiSelectComboboxContext = createContext<MultiSelectComboboxContextState<any> | null>(null);

export const useMultiSelectComboboxContext = <T,>() => {
  const context = useContext(MultiSelectComboboxContext as React.Context<MultiSelectComboboxContextState<T> | null>);
  if (!context) {
    throw new Error("useMultiSelectComboboxContext must be used within a MultiSelectComboboxProvider");
  }
  return context;
};