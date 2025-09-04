'use client'

import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item'
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant"
import { logoutAction } from "@/libs/server/logout/actions/logout-action"
import { REDIRECT_PUBLIC_PATH } from "@/libs/share/_general/utils/path"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"

export default function LogoutDropdownMenuItem() {
  const router = useRouter();

  const onClick = async () => {
    const response = await logoutAction()
    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    router.push(REDIRECT_PUBLIC_PATH)
  }
  return (
    <CustomDropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </CustomDropdownMenuItem>
  )
}