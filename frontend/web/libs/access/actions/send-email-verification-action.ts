'use server'

import { SendEmailVerificationRequest } from "../models/send-email-verification-request"
import { sendEmailVerificationService } from "../services/send-email-verification-service"

export const sendEmailVerificationAction = async (request: SendEmailVerificationRequest) =>
  await sendEmailVerificationService(request)
