'use server'

import { SignUpRequest } from "./sign-up-request"
import { signUp } from "./sign-up-service"

export const signUpAction = async (request: SignUpRequest) =>
  await signUp(request)