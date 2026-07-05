'use server'

import { logout } from "./logout-service"

export const logoutAction = async () =>
  await logout()