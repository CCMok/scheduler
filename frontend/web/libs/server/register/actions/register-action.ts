'use server'

import { RegisterRequest } from "../models/register-request"
import { registerService } from "../services/register-service"

export const registerAction = async (request: RegisterRequest) =>
 await registerService(request)
