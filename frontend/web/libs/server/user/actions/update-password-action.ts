'use server'

import { UpdatePasswordRequest } from "../models/update-password-request"
import { updatePassword } from "../services/update-password-service"

export const updatePasswordAction = async (request: UpdatePasswordRequest) => 
  await updatePassword(request)