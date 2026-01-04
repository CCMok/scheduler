import { ServiceResponse } from "@/libs/_general/service/response"
import { tryCatch } from "@/libs/_general/service/try-catch"
import { deleteSession } from "@/libs/_general/session/session-manager"

export const logout = tryCatch(async (): Promise<ServiceResponse> => {
  await deleteSession()
  return {
    isSuccess: true,
  }
})