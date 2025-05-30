import { type VariantProps } from "class-variance-authority";
import {
  WandSparkles,
} from "lucide-react";
import { cn } from "@/external/shadcn/libs/utils";
import { Button } from "@/external/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/external/shadcn/components/ui/popover";
import { FormControl } from "@/external/shadcn/components/ui/form";
import { ButtonHTMLAttributes, useState, KeyboardEvent } from "react";
import {
  multiSelectVariants,
  TriggerButtonDisplay,
  CommandListContent,
} from "./multi-select-command-parts";

type Props<T> = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof multiSelectVariants> & {
    /**
     * An array of option objects to be displayed in the multi-select component.
     * Each option object has a label, value, and an optional icon.
     */
    items: T[];

    /**
     * Callback function triggered when the selected values change.
     * Receives an array of the new selected values.
     */
    onValueChange: (value: string[]) => void;

    /** The default selected values when the component mounts. */
    defaultValue?: string[];

    /**
     * Placeholder text to be displayed when no values are selected.
     * Optional, defaults to "Select options".
     */
    placeholder?: string;

    /**
     * Animation duration in seconds for the visual effects (e.g., bouncing badges).
     * Optional, defaults to 0 (no animation).
     */
    animation?: number;

    /**
     * Maximum number of items to display. Extra selected items will be summarized.
     * Optional, defaults to 3.
     */
    maxCount?: number;

    /**
     * The modality of the popover. When set to true, interaction with outside elements
     * will be disabled and only popover content will be visible to screen readers.
     * Optional, defaults to false.
     */
    modalPopover?: boolean;

    /**
     * If true, renders the multi-select component as a child of another component.
     * Optional, defaults to false.
     */
    asChild?: boolean;

    /**
     * Additional class names to apply custom styles to the multi-select component.
     * Optional, can be used to add custom styles.
     */
    className?: string;

    isShowAnimationButton?: boolean;

    getValue: (item: T) => string;
    
    getDisplayName: (item: T) => string;
  }

export default function MultiSelectCommand<T>({
  items,
  onValueChange,
  variant,
  defaultValue = [],
  placeholder = "選擇",
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  className,
  isShowAnimationButton = false,
  getValue,
  getDisplayName,
  ...props
}: Readonly<Props<T>>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateSelectedValues = (newValues: string[]) => {
    setSelectedValues(newValues);
    onValueChange(newValues);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return;
    }

    if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.pop();
      updateSelectedValues(newSelectedValues);
    }
  };

  const toggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(value => value !== optionValue)
      : [...selectedValues, optionValue];
    updateSelectedValues(newSelectedValues);
  };

  const handleClearAll = () => {
    updateSelectedValues([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen(prev => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxCount);
    updateSelectedValues(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === items.length) {
      handleClearAll();
    } else {
      const allValues = items.map(getValue);
      updateSelectedValues(allValues);
    }
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
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
              selectedValues={selectedValues}
              items={items}
              getValue={getValue}
              getDisplayName={getDisplayName}
              maxCount={maxCount}
              variant={variant}
              animation={animation}
              isAnimating={isAnimating}
              onToggleOption={toggleOption}
              onClearExtraOptions={clearExtraOptions}
              onClearAll={handleClearAll}
              placeholder={placeholder}
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
          items={items}
          selectedValues={selectedValues}
          getValue={getValue}
          getDisplayName={getDisplayName}
          onToggleOption={toggleOption}
          onToggleAll={toggleAll}
          onClearAll={handleClearAll}
          onClosePopover={() => setIsPopoverOpen(false)}
          onInputKeyDown={handleInputKeyDown}
        />
      </PopoverContent>
      {animation > 0 && selectedValues.length > 0 && isShowAnimationButton && (
        <WandSparkles
          className={cn(
            "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
            isAnimating ? "" : "text-muted-foreground"
          )}
          onClick={() => setIsAnimating(!isAnimating)}
        />
      )}
    </Popover>
  );
};