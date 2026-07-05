'use server'

import { SignUpVerifyTokenRequest } from "./sign-up-verify-token-request"
import { signUpVerifyToken } from "./sign-up-verify-token-service"

export const signUpVerifyTokenAction = async (request: SignUpVerifyTokenRequest) =>
  await signUpVerifyToken(request)