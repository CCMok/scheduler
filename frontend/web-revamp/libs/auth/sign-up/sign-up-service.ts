import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import prisma from '@/libs/_general/database/database-manager';
import { Message } from '@/libs/_general/service/message';
import { hash } from 'bcryptjs';
import { SignUpRequest, signUpRequestSchema } from './sign-up-request';
import { SALT_ROUNDS } from '@/libs/_general/bcrypt/bcrypt-utils';
import { User } from '@/external/prisma/generated/client';
import { handlePersistError } from '@/libs/_general/database/database-utils';
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code';
import { DEFAULT_ROLE } from '../authorization/role';
import { sendEmailVerification } from '@/libs/_general/email/email-verification-manager';

export const signUp = tryCatch(async (request: SignUpRequest): Promise<ServiceResponse> => {
  const parsedRequest = signUpRequestSchema.parse(request)

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  const saveResult = await saveEntity(parsedRequest, encryptedPassword)
  if (!saveResult.isSuccess) return saveResult

  const emailSent = await sendEmailVerification(saveResult.data)
  if (!emailSent) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  return {
    isSuccess: true,
  }
})

export const saveEntity = async (request: SignUpRequest, encryptedPassword: string): Promise<ServiceResponse<User>> => {
  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        email: request.email,
        password: encryptedPassword,
        name: request.name,
        roleId: DEFAULT_ROLE,
        isEmailVerified: false,
      },
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION, () => ({
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '電郵地址'),
      })],
    ]))
  }

  return {
    isSuccess: true,
    data: user,
  }
}