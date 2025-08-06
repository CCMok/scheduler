'use server'

import { UpdateUserNameRequest } from "../models/update-user-name-request"
import { updateUserNameService } from "../services/update-user-name-service"

export const updateUserNameAction = async (request: UpdateUserNameRequest) => 
  await updateUserNameService(request)