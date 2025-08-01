'use server'

import { RegisterRequest } from "../models/register-request"
import { register } from "../services/register-service"

export const registerAction = async (request: RegisterRequest) =>
 await register(request)
