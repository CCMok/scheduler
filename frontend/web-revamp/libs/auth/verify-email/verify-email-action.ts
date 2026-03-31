'use server'

import { VerifyEmailRequest } from "./verify-email-request"
import { verifyEmail } from "./verify-email-service"

export const verifyEmailAction = async (request: VerifyEmailRequest) =>
  await verifyEmail(request)