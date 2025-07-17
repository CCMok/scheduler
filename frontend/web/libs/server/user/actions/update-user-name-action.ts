'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { UpdateUserNameRequest } from "../models/update-user-name-request"
import { updateUserName } from "../services/update-user-name-service"

export const updateUserNameAction = async (request: UpdateUserNameRequest) => 
  await actionWrapper(async () => await updateUserName(request))