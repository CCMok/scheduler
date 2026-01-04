import { DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar";
import { getSession } from "@/libs/_general/session/session-manager";
import { ChevronDown, User } from "lucide-react";

export default async function UserDropdownMenuTrigger() {
  const session = await getSession()
  const userName = session?.name ?? session?.email ?? ''
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton>
        <User />
        <span className='truncate'>{userName}</span>
        <ChevronDown className='ml-auto' />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  )
}