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
    animation?: number;
    maxDisplayCount?: number;
    selectedItemVariant?: VariantProps<typeof multiSelectVariants>['variant'];
  }

export default function MultiSelectCombobox<T>({
  className,
  values,
  options,
  onValueChange,
  selectedItemVariant,
  animation = 0,
  maxDisplayCount = 3,
  getValue,
  getDisplayName,
  ...props
}: Readonly<Props<T>>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateSelectedValues = (newValues: string[]) => {
    onValueChange(newValues);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return;
    }

    if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...values];
      newSelectedValues.pop();
      updateSelectedValues(newSelectedValues);
    }
  };

  const toggleOption = (optionValue: string) => {
    const newSelectedValues = values.includes(optionValue)
      ? values.filter(value => value !== optionValue)
      : [...values, optionValue];
    updateSelectedValues(newSelectedValues);
  };

  const handleClearAll = () => {
    updateSelectedValues([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen(prev => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = values.slice(0, maxDisplayCount);
    updateSelectedValues(newSelectedValues);
  };

  const toggleAll = () => {
    if (values.length === options.length) {
      handleClearAll();
    } else {
      const allValues = options.map(getValue);
      updateSelectedValues(allValues);
    }
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            onClick={handleTogglePopover}
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
              animation={animation}
              isAnimating={isAnimating}
              onToggleOption={toggleOption}
              onClearExtraOptions={clearExtraOptions}
              onClearAll={handleClearAll}
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
          onToggleOption={toggleOption}
          onToggleAll={toggleAll}
          onClearAll={handleClearAll}
          onClosePopover={() => setIsPopoverOpen(false)}
          onInputKeyDown={handleInputKeyDown}
        />
      </PopoverContent>
    </Popover>
  );
};