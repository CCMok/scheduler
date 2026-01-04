'use client'

import { DropdownMenuItem } from "@/external/shadcn/components/ui/dropdown-menu";
import { REDIRECT_PUBLIC_PATH } from "@/libs/_general/path/path";
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
    router.push(REDIRECT_PUBLIC_PATH)
  }
  return (
    <DropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </DropdownMenuItem>
  )
}