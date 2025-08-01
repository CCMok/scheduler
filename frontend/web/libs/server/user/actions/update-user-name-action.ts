'use server'

import { UpdateUserNameRequest } from "../models/update-user-name-request"
import { updateUserName } from "../services/update-user-name-service"

export const updateUserNameAction = async (request: UpdateUserNameRequest) => 
  await updateUserName(request)