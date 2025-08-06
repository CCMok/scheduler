'use server'

import { UpdatePasswordRequest } from "../models/update-password-request"
import { updatePasswordService } from "../services/update-password-service"

export const updatePasswordAction = async (request: UpdatePasswordRequest) => 
  await updatePasswordService(request)