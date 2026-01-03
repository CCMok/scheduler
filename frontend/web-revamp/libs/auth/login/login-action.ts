'use server'

import { LoginRequest } from "./login-request"
import { login } from "./login-service"

export const loginAction = async (request: LoginRequest) =>
  await login(request)