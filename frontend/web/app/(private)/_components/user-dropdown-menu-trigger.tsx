import { DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu";
import { ROUTE } from "@/libs/_general/route/route-config";
import { getSession } from "@/libs/_general/session/session-manager";
import { ChevronDown, User } from "lucide-react";
import ActiveSidebarMenuButton from "./active-sidebar-menu-button";

export default async function UserDropdownMenuTrigger() {
  const session = await getSession();
  const userName = session?.name ?? session?.email ?? "";
  return (
    <DropdownMenuTrigger asChild>
      <ActiveSidebarMenuButton activeBase={ROUTE.private.setting.user}>
        <User />
        <span className="truncate">{userName}</span>
        <ChevronDown className="ml-auto" />
      </ActiveSidebarMenuButton>
    </DropdownMenuTrigger>
  );
}