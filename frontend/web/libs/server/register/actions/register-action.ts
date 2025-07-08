'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { RegisterRequest } from "../models/register-request"
import { register } from "../services/register-service"

export const registerAction = async (request: RegisterRequest) =>
  await actionWrapper(async () => await register(request))
