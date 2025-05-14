'use server'

import { LoginRequest } from "@/libs/share/login/model/login-request"
import { login } from "../service/login-service"

export const loginAction = async (request: LoginRequest) =>
  login(request)