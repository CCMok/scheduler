'use server'

import { ResetUpdatePasswordRequest } from "./reset-update-password-request"
import { resetUpdatePassword } from "./reset-update-password-service"

export const resetUpdatePasswordAction = async (request: ResetUpdatePasswordRequest) =>
  await resetUpdatePassword(request)