'use client'

import { type VariantProps } from "class-variance-authority";
import { cn } from "@/external/shadcn/libs/utils";
import { Button } from "@/external/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/external/shadcn/components/ui/popover";
import { FormControl } from "@/external/shadcn/components/ui/form";
import { useState, KeyboardEvent, ComponentProps } from "react";
import {
  multiSelectVariants,
  TriggerButtonDisplay,
  CommandListContent,
} from "./multi-select-combobox-parts";

type Props<T> = ComponentProps<typeof Button> & {
  values: string[];
  onValueChange: (value: string[]) => void;
  options: T[];
  getValue: (option: T) => string;
  getDisplayName: (option: T) => string;
  maxDisplayCount?: number;
  selectedItemVariant?: VariantProps<typeof multiSelectVariants>['variant'];
}

export default function MultiSelectCombobox<T>({
  className,
  values,
  onValueChange,
  options,
  getValue,
  getDisplayName,
  maxDisplayCount = 3,
  selectedItemVariant,
  ...props
}: Readonly<Props<T>>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return;
    }

    if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...values];
      newSelectedValues.pop();
      onValueChange(newSelectedValues);
    }
  };

  const onToggleOption = (optionValue: string) => {
    const newSelectedValues = values.includes(optionValue)
      ? values.filter(value => value !== optionValue)
      : [...values, optionValue];
    onValueChange(newSelectedValues);
  };

  const onClearAll = () => onValueChange([]);

  const onClickPopoverButton = () => setIsPopoverOpen(prev => !prev);

  const onClearExtraOptions = () => {
    const newSelectedValues = values.slice(0, maxDisplayCount);
    onValueChange(newSelectedValues);
  };

  const onToggleAll = () => {
    if (values.length === options.length) {
      onClearAll();
      return
    }

    const allValues = options.map(getValue);
    onValueChange(allValues);
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            onClick={onClickPopoverButton}
            role='combobox'
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto min-w-(--input-width)",
              className
            )}
            {...props}
          >
            <TriggerButtonDisplay
              selectedValues={values}
              options={options}
              getValue={getValue}
              getDisplayName={getDisplayName}
              maxCount={maxDisplayCount}
              variant={selectedItemVariant}
              onToggleOption={onToggleOption}
              onClearExtraOptions={onClearExtraOptions}
              onClearAll={onClearAll}
            />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <CommandListContent
          options={options}
          selectedValues={values}
          getValue={getValue}
          getDisplayName={getDisplayName}
          onToggleOption={onToggleOption}
          onToggleAll={onToggleAll}
          onClearAll={onClearAll}
          onClosePopover={() => setIsPopoverOpen(false)}
          onInputKeyDown={onInputKeyDown}
        />
      </PopoverContent>
    </Popover>
  );
};