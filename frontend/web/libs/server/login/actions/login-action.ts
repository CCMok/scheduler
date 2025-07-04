'use server'

import { LoginRequest } from "@/libs/server/login/models/login-request"
import { login } from "../services/login-service"
import { actionWrapper } from "../../_general/actions/general-action"

export const loginAction = async (request: LoginRequest) =>
  await actionWrapper(async () => await login(request))
