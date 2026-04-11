'use server'

import { UpdatePasswordRequest } from "./update-password-request"
import { updatePassword } from "./update-password-service"

export const updatePasswordAction = async (request: UpdatePasswordRequest) =>
  await updatePassword(request)