import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { ResetPasswordVerifyTokenRequest, resetPasswordVerifyTokenRequestSchema } from './reset-password-verify-token-request';
import { SessionPayload, sessionPayloadSchema } from '@/libs/_general/session/session';
import { decrypt } from '@/libs/_general/jwt/jwt-manager';
import { Message } from '@/libs/_general/service/message';
import prisma from '@/libs/_general/database/database-manager';
import { UserOmitPassword } from '@/libs/user/user';

export const resetPasswordVerifyToken = tryCatch(async (request: ResetPasswordVerifyTokenRequest): Promise<ServiceResponse<UserOmitPassword>> => {
  const parsedRequest = resetPasswordVerifyTokenRequestSchema.parse(request)

  const payload = await decryptToken(parsedRequest.token)
  if (!payload) return {
    isSuccess: false,
    message: '連結已失效，請重新嘗試。',
  }

  const user = await getUser(payload.userId)
  if (!user) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  return {
    isSuccess: true,
    data: user,
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

const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  })
}
