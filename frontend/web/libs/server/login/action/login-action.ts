'use server'

import { LoginRequest } from "@/libs/share/login/model/login-request"
import { login } from "../service/login-service"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"

export const loginAction = async (request: LoginRequest): ReturnType<Awaited<typeof login>> => {
  try {
    return await login(request)
  } catch (e) {
    console.error(e)
    return {
      status: ServerResponseStatus.INTERNAL_ERROR,
    }
  }  
}