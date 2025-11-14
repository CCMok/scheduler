'use server'

import { ResetPasswordRequest } from "@/libs/access/models/reset-password-request"
import { resetPasswordService } from "../services/reset-password-service"

export const resetPasswordAction = async (request: ResetPasswordRequest) =>
  await resetPasswordService(request)
