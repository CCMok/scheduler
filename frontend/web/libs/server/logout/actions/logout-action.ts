'use server'

import { logout } from "../services/logout-service"

export const logoutAction = async () => await logout()