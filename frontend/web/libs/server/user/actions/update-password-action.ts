'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { UpdatePasswordRequest } from "../models/update-password-request"
import { updatePassword } from "../services/update-password-service"

export const updatePasswordAction = async (request: UpdatePasswordRequest) => 
  await actionWrapper(async () => await updatePassword(request))