import { DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar"
import { getSession } from "@/libs/server/_general/manager/session-manager"
import { ChevronDown, User } from "lucide-react"

const getUserDisplayName = async (): Promise<string> => {
  const session = await getSession();
  if (!session) return '';

  return session.name ?? session.email;
}

export default async function DropdownMenuTriggerUser() {
  const userDispalyName = await getUserDisplayName();

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton>
        <User />
        <span>{userDispalyName}</span>
        <ChevronDown className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  )
}