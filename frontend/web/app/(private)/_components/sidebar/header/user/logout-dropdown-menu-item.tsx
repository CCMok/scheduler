'use client'

import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item'
import { logoutAction } from "@/libs/access/actions/logout-action"
import { REDIRECT_PUBLIC_PATH } from "@/libs/_general/enums/path"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { handleCudResponse } from '@/libs/_general/utils/response-utils'
import { isNil } from 'lodash'

export default function LogoutDropdownMenuItem() {
  const router = useRouter();

  const onClick = async () => {
    const response = await logoutAction()

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    router.push(REDIRECT_PUBLIC_PATH)
  }
  return (
    <CustomDropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </CustomDropdownMenuItem>
  )
}