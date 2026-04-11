import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { UpdatePasswordRequest, updatePasswordRequestSchema } from './update-password-request';
import { getSession } from '@/libs/_general/session/session-manager';
import { Message } from '@/libs/_general/service/message';
import prisma from '@/libs/_general/database/database-manager';
import { compare, hash } from 'bcryptjs';
import { SALT_ROUNDS } from '@/libs/_general/bcrypt/bcrypt-utils';

export const updatePassword = tryCatch(async (request: UpdatePasswordRequest): Promise<ServiceResponse> => {
  const parsedRequest = updatePasswordRequestSchema.parse(request)

  const session = await getSession()
  if (!session) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const user = await getUser(session.userId)
  if (!user) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const isCurrentPasswordCorrect = await compare(parsedRequest.currentPassword, user.password)
  if (!isCurrentPasswordCorrect) return {
    isSuccess: false,
    message: '舊密碼' + Message.INCORRECT,
  }

  const encryptedNewPassword = await hash(parsedRequest.newPassword, SALT_ROUNDS)

  await saveNewPassword(user.id, encryptedNewPassword)

  return {
    isSuccess: true,
  }
})

const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  })
}

const saveNewPassword = async (id: number, password: string) => {
  return await prisma.user.update({
    where: { id },
    data: { password },
  })
}