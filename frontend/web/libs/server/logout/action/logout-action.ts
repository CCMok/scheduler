'use server'

import { actionWrapper } from "../../_general/actions/general_action"
import { logout } from "../service/logout-service"

export const logoutAction = async () => {
  return await actionWrapper(() => logout())
}