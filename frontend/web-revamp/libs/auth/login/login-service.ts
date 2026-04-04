import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { LoginRequest, loginRequestSchema } from "./login-request";
import { tryCatch } from '@/libs/_general/service/try-catch';
import prisma from '@/libs/_general/database/database-manager';
import { Message } from '@/libs/_general/service/message';
import { compare } from 'bcryptjs';
import { createSession } from '@/libs/_general/session/session-manager';
import { Role } from '../general/role';

const CREDENTIAL_ERROR = '電郵地址或密碼' + Message.INCORRECT

export const login = tryCatch(async (request: LoginRequest): Promise<ServiceResponse> => {
  const parsedRequest = loginRequestSchema.parse({ ...request })

  const user = await getUser(parsedRequest.email);
  if (!user) return {
    isSuccess: false,
    message: CREDENTIAL_ERROR,
  }

  const isPasswordCorrect = await compare(parsedRequest.password, user.password)
  if (!isPasswordCorrect) return {
    isSuccess: false,
    message: CREDENTIAL_ERROR,
  }

  if (user.roleId !== Role.SYSTEM_ADMIN) {
    if (!user.isEmailVerified) return {
      isSuccess: false,
      message: Message.NOT_VERIFIED,
    }
  }

  await createSession(user)

  return {
    isSuccess: true,
  }
})

const getUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}
