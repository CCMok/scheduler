import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { CheckIcon, XCircle, XIcon, ChevronDown } from "lucide-react";
import { cn } from "@/external/shadcn/libs/utils";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { Badge } from "@/external/shadcn/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/external/shadcn/components/ui/command";
import type { KeyboardEvent } from "react";

export const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type MultiSelectVariant = VariantProps<typeof multiSelectVariants>["variant"];

// --- Component 1: SelectedBadgesDisplay ---
interface SelectedBadgesDisplayProps<T> {
  selectedValues: string[];
  items: T[];
  getValue: (item: T) => string;
  getDisplayName: (item: T) => string;
  maxCount: number;
  variant: MultiSelectVariant;
  animation: number;
  isAnimating: boolean;
  onToggleOption: (value: string) => void;
  onClearExtraOptions: () => void;
}

export function SelectedBadgesDisplay<T>({
  selectedValues,
  items,
  getValue,
  getDisplayName,
  maxCount,
  variant,
  animation,
  isAnimating,
  onToggleOption,
  onClearExtraOptions,
}: Readonly<SelectedBadgesDisplayProps<T>>) {
  return (
    <div className="flex flex-wrap items-center">
      {selectedValues.slice(0, maxCount).map(value => {
        const option = items.find(item => getValue(item) === value);
        return (
          <Badge
            key={value}
            className={cn(
              isAnimating ? "animate-bounce" : "",
              multiSelectVariants({ variant })
            )}
            style={{ animationDuration: `${animation}s` }}
          >
            {option && getDisplayName(option)}
            <span
              role='button'
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onToggleOption(value);}}}
              onClick={event => {
                event.stopPropagation();
                onToggleOption(value);
              }}
            >
              <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
            </span>
          </Badge>
        );
      })}
      {selectedValues.length > maxCount && (
        <Badge
          className={cn(
            "bg-transparent text-foreground border-foreground/10 hover:bg-transparent",
            isAnimating ? "animate-bounce" : "",
            multiSelectVariants({ variant }),
          )}
          style={{ animationDuration: `${animation}s` }}
        >
          {`+ ${selectedValues.length - maxCount} more`}
          <span
            role='button'
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onClearExtraOptions();}}}
            onClick={event => {
              event.stopPropagation();
              onClearExtraOptions();
            }}
          >
            <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
          </span>
        </Badge>
      )}
    </div>
  );
}

// --- Component 2: TriggerButtonDisplay ---
interface TriggerButtonDisplayProps<T> extends SelectedBadgesDisplayProps<T> {
  onClearAll: () => void;
  placeholder: string;
}

export function TriggerButtonDisplay<T>({
  selectedValues,
  items,
  getValue,
  getDisplayName,
  maxCount,
  variant,
  animation,
  isAnimating,
  onToggleOption,
  onClearExtraOptions,
  onClearAll,
  placeholder,
}: Readonly<TriggerButtonDisplayProps<T>>) {
  if (!selectedValues.length) {
    return (
      <div className="flex items-center justify-between w-full mx-auto">
        <span className="text-sm text-muted-foreground mx-3">
          {placeholder}
        </span>
        <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full">
      <SelectedBadgesDisplay
        selectedValues={selectedValues}
        items={items}
        getValue={getValue}
        getDisplayName={getDisplayName}
        maxCount={maxCount}
        variant={variant}
        animation={animation}
        isAnimating={isAnimating}
        onToggleOption={onToggleOption}
        onClearExtraOptions={onClearExtraOptions}
      />
      <div className="flex items-center justify-between">
        <span
          role='button'
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onClearAll();}}}
          onClick={event => {
            event.stopPropagation();
            onClearAll();
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
  );
}

// --- Component 3: CommandListContent ---
interface CommandListContentProps<T> {
  items: T[];
  selectedValues: string[];
  getValue: (item: T) => string;
  getDisplayName: (item: T) => string;
  onToggleOption: (value: string) => void;
  onToggleAll: () => void;
  onClearAll: () => void;
  onClosePopover: () => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function CommandListContent<T>({
  items,
  selectedValues,
  getValue,
  getDisplayName,
  onToggleOption,
  onToggleAll,
  onClearAll,
  onClosePopover,
  onInputKeyDown,
}: Readonly<CommandListContentProps<T>>) {
  return (
    <Command>
      <CommandInput
        placeholder="搜尋..."
        onKeyDown={onInputKeyDown}
      />
      <CommandList>
        <CommandEmpty>沒有資料</CommandEmpty>
        <CommandGroup>
          <CommandItem
            key="all"
            onSelect={onToggleAll}
            className="cursor-pointer"
          >
            <div
              className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                selectedValues.length === items.length && items.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "opacity-50 [&_svg]:invisible"
              )}
            >
              <CheckIcon className="h-4 w-4" />
            </div>
            <span>(選擇全部)</span>
          </CommandItem>
          {items.map(option => {
            const isSelected = selectedValues.includes(getValue(option));
            return (
              <CommandItem
                key={getValue(option)}
                onSelect={() => onToggleOption(getValue(option))}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>{getDisplayName(option)}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <div className="flex items-center justify-between">
            {selectedValues.length > 0 && (
              <>
                <CommandItem
                  onSelect={onClearAll}
                  className="flex-1 justify-center cursor-pointer"
                >
                  清除
                </CommandItem>
                <Separator
                  orientation="vertical"
                  className="flex min-h-6 h-full"
                />
              </>
            )}
            <CommandItem
              onSelect={onClosePopover}
              className="flex-1 justify-center cursor-pointer max-w-full"
            >
              關閉
            </CommandItem>
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
