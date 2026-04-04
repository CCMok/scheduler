'use server'

import { resetPassword } from "./reset-password-service"
import { ResetPasswordRequest } from "./reset-password-request"

export const resetPasswordAction = async (request: ResetPasswordRequest) =>
  await resetPassword(request)