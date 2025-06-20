'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { logout } from "../service/logout-service"

export const logoutAction = async () =>
  await actionWrapper(async () => await logout())