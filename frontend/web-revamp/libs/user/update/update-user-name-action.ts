'use server'

import { UpdateUserNameRequest } from "./update-user-name-request";
import { updateUserName } from "./update-user-name-service";

export const updateUserNameAction = async (request: UpdateUserNameRequest) =>
  await updateUserName(request)