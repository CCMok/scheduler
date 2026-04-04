'use server'

import { ResetPasswordVerifyTokenRequest } from "./reset-password-verify-token-request"
import { resetPasswordVerifyToken } from "./reset-password-verify-token-service"

export const resetPasswordVerifyTokenAction = async (request: ResetPasswordVerifyTokenRequest) =>
  await resetPasswordVerifyToken(request)