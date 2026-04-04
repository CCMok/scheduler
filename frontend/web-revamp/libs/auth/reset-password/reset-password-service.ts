import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { ResetPasswordRequest } from './reset-password-request';

export const resetPassword = tryCatch(async (request: ResetPasswordRequest): Promise<ServiceResponse> => {
  // TODO
  return {
    isSuccess: true,
  }
})