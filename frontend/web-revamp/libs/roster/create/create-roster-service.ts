import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateRosterRequest } from './create-roster-request'
import { CreateResponseData, ServiceResponse } from '@/libs/_general/service/response'

export const createRoster = tryCatch(async (request: CreateRosterRequest): Promise<ServiceResponse<CreateResponseData>> => {
  console.log(request)
  return {
    isSuccess: false,
    message: 'Not implemented',
  }
})