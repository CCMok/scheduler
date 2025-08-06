'use server'

import { logoutService } from "../services/logout-service"

export const logoutAction = async () => await logoutService()