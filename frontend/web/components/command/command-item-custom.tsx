import { CommandItem } from "@/external/shadcn/components/ui/command";
import { ComponentProps } from "react";

export default function CommandItemCustom(props: Readonly<ComponentProps<typeof CommandItem>>) {
  return (
    <CommandItem
      className='cursor-pointer'
      {...props}
    />
  )
}