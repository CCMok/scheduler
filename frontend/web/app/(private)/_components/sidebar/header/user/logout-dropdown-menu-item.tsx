'use client'

import CustomDropdownMenuItem from "@/components/dropdown/custom-dropdown-menu-item"
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant"
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook"
import { ClientMessage } from "@/libs/client/_general/models/client-message-model"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { logoutAction } from "@/libs/server/logout/action/logout-action"
import { redirectPublicPath } from "@/libs/share/_general/enums/path"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
    if (serverResponse.status != ServerResponseStatus.UNAUTHORIZED) {
      toast.error(clientMessage.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: clientMessage.content,
      })
    }
  }

  return (
    <CustomDropdownMenuItem onClick={onClick}>
      <LogOut />
      <span>登出</span>
    </CustomDropdownMenuItem>
  )
}