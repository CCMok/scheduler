'use server'

import { SignUpVerifyEmailRequest } from "./sign-up-verify-email-request"
import { signUpVerifyEmail } from "./sign-up-verify-email-service"

export const signUpVerifyEmailAction = async (request: SignUpVerifyEmailRequest) =>
  await signUpVerifyEmail(request)