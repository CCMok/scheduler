'use server'

import { LoginRequest } from "@/libs/server/login/models/login-request"
import { loginService } from "../services/login-service"

export const loginAction = async (request: LoginRequest) =>
  await loginService(request)
