import { ComponentProps } from "react";
import { DropdownMenuItem } from "@/external/shadcn/components/ui/dropdown-menu"
import { cn } from "@/external/shadcn/libs/utils";

export default function CustomDropdownMenuItem({
  className,
  ...props
}: Readonly<ComponentProps<typeof DropdownMenuItem>>) {
  return (
    <DropdownMenuItem
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
}