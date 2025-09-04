'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/external/shadcn/components/ui/command";
import { useMultiSelectComboboxContext } from "../multi-select-combobox-context";
import { PopoverContent } from "@/external/shadcn/components/ui/popover";
import SelectAllCommandItem from "./select-all-command-item";
import SoleCommandItem from "./sole-command-item";
import ContentCommandInput from "./content-command-input";
import ClearCommandItem from "./clear-command-item";

export default function MultiSelectComboboxContent<T>() {
  const {
    values,
    options,
    getValue,
    setIsPopoverOpen,
  } = useMultiSelectComboboxContext<T>();

  return (
    <PopoverContent
      className="w-auto p-0"
      align="start"
      onEscapeKeyDown={() => setIsPopoverOpen(false)}
    >
      <Command>
        <ContentCommandInput />
        <CommandList>
          <CommandEmpty>沒有資料</CommandEmpty>
          <CommandGroup>
            <SelectAllCommandItem />
            {options.map(option =>
              <SoleCommandItem
                key={getValue(option)}
                option={option}
              />
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <div className="flex items-center justify-between">
              {values.length > 0 && <ClearCommandItem />}
              <CommandItem
                onSelect={() => setIsPopoverOpen(false)}
                className="flex-1 justify-center cursor-pointer max-w-full"
              >
                關閉
              </CommandItem>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}