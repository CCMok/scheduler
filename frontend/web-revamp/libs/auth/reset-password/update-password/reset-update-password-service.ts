import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { ResetUpdatePasswordRequest, resetUpdatePasswordRequestSchema } from './reset-update-password-request';
import { SessionPayload, sessionPayloadSchema } from '@/libs/_general/session/session';
import { decrypt } from '@/libs/_general/jwt/jwt-manager';
import { hash } from 'bcryptjs';
import { SALT_ROUNDS } from '@/libs/_general/bcrypt/bcrypt-utils';
import prisma from '@/libs/_general/database/database-manager';
import { User } from '@/external/prisma/generated/client';
import { handlePersistError } from '@/libs/_general/database/database-utils';
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code';
import { Message } from '@/libs/_general/service/message';
import { createSession } from '@/libs/_general/session/session-manager';

export const resetUpdatePassword = tryCatch(async (request: ResetUpdatePasswordRequest): Promise<ServiceResponse> => {
  const parsedRequest = resetUpdatePasswordRequestSchema.parse(request)

  const payload = await decryptToken(parsedRequest.token)
  if (!payload) return {
    isSuccess: false,
    message: '連結已失效，請重新嘗試。',
  }

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  const updateResult = await updatePassword(payload.userId, encryptedPassword)
  if (!updateResult.isSuccess) return updateResult

  await createSession(updateResult.data)

  return {
    isSuccess: true,
  }
})

const decryptToken = async (token: string): Promise<SessionPayload | undefined> => {
  const payload = await decrypt(token)
  if (!payload) return

  const parseResult = sessionPayloadSchema.safeParse(payload)
  if (!parseResult.success) {
    console.error('Invalid session payload')
    console.error(parseResult.error)
    return
  }

  return parseResult.data
}

const updatePassword = async (userId: number, password: string): Promise<ServiceResponse<User>> => {
  let user: User;
  try {
    user = await prisma.user.update({
      where: { id: userId },
      data: { password },
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.NOT_FOUND, () => ({
        isSuccess: false,
        message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
      })],
    ]))
  }

  return {
    isSuccess: true,
    data: user,
  }
}