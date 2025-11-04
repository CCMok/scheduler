import { DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar"
import { getSession } from "@/libs/access/managers/session-manager"
import { ChevronDown, User } from "lucide-react"

const getUserDisplayName = async (): Promise<string> => {
  const session = await getSession();
  if (!session) return '';

  return session.name ?? session.email;
}

export default async function UserDropdownMenuTrigger() {
  const userDispalyName = await getUserDisplayName();

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton>
        <User />
        <span className='truncate'>{userDispalyName}</span>
        <ChevronDown className='ml-auto' />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  )
}