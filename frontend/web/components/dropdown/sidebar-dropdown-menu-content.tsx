import { DropdownMenuContent } from "@/external/shadcn/components/ui/dropdown-menu";
import { ComponentProps } from "react";

export default function SidebarDropdownMenuContent(props: Readonly<ComponentProps<typeof DropdownMenuContent>>) {
  return (
    <DropdownMenuContent className='w-(--radix-dropdown-menu-trigger-width)' {...props} />
  )
}