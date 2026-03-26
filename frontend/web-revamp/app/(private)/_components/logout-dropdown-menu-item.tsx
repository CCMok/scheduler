'use client'

import { DropdownMenuItem } from "@/external/shadcn/components/ui/dropdown-menu";
import { REDIRECT_PUBLIC_ROUTE } from "@/libs/_general/route/route";
import { logoutAction } from "@/libs/auth/logout/logout-action";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutDropdownMenuItem() {
  const router = useRouter()
  const onClick = async () => {
    const response = await logoutAction()
    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }
    toast.success('登出成功')
    router.push(REDIRECT_PUBLIC_ROUTE)
  }
  return (
    <DropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </DropdownMenuItem>
  )
}