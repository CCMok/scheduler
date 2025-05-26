'use client'

import DropdownMenuItem from "@/components/dropdown/dropdown-menu-item"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { logoutAction } from "@/libs/server/logout/action/logout-action"
import { redirectPublicPath } from "@/libs/share/_general/enums/path"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DropdownMenuItemLogout() {
  const router = useRouter();

  const onClick = async () => {
    const response = await logoutAction()
    if (response.status !== ServerResponseStatus.OK) {
      console.error('Invalid logout status:', response.status)
      return;
    }

    router.push(redirectPublicPath);
  }

  return (
    <DropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </DropdownMenuItem>
  )
}