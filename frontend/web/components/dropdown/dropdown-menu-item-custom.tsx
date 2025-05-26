import { ComponentProps } from "react";
import { DropdownMenuItem } from "@/external/shadcn/components/ui/dropdown-menu"

export default function DropdownMenuItemCustom(props: Readonly<ComponentProps<typeof DropdownMenuItem>>) {
  return (
    <DropdownMenuItem
      className='cursor-pointer'
      {...props}
    />
  )
}