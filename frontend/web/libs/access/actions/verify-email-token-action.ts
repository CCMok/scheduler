'use server'

import { VerifyEmailTokenRequest } from "../models/verify-email-token-request"
import { verifyEmailTokenService } from "../services/verify-email-token-service"

export const verifyEmailTokenAction = async (request: VerifyEmailTokenRequest) =>
  await verifyEmailTokenService(request)
