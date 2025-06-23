'use client'

import CustomDropdownMenuItem from "@/components/dropdown/custom-dropdown-menu-item"
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook"
import { ClientMessage } from "@/libs/client/_general/models/client-message-model"
import { logoutAction } from "@/libs/server/logout/action/logout-action"
import { redirectPublicPath } from "@/libs/share/_general/enums/path"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutDropdownMenuItem() {
  const router = useRouter();

  const { handleServerResponse } = useServerResponseHandler();

  const onClick = async () => {
    const response = await logoutAction()
    await handleServerResponse(response, onSuccess, onError);
  }

  const onSuccess = () => {
    router.push(redirectPublicPath);
  }

  const onError = (serverResponse: ServerResponse, clientMessage: ClientMessage) => {
    // TODO: toast if not unauthorized
  }

  return (
    <CustomDropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </CustomDropdownMenuItem>
  )
}