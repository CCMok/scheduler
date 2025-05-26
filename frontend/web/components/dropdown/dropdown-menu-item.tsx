import { ComponentProps } from "react";
import { DropdownMenuItem as ShadcnDropdownMenuItem } from "@/external/shadcn/components/ui/dropdown-menu"

export default function DropdownMenuItem(props: Readonly<ComponentProps<typeof ShadcnDropdownMenuItem>>) {
  return (
    <ShadcnDropdownMenuItem
      className='cursor-pointer'
      {...props}
    />
  )
}