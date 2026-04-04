import 'server-only'
import { SignUpVerifyEmailRequest, signUpVerifyEmailRequestSchema } from './sign-up-verify-email-request'
import { ServiceResponse } from '@/libs/_general/service/response'
import { SessionPayload, sessionPayloadSchema } from '@/libs/_general/session/session'
import { decrypt } from '@/libs/_general/jwt/jwt-manager'
import { User } from '@/external/prisma/generated/client'
import prisma from '@/libs/_general/database/database-manager'
import { Message } from '@/libs/_general/service/message'
import { createSession } from '@/libs/_general/session/session-manager'

export const signUpVerifyEmail = async (request: SignUpVerifyEmailRequest): Promise<ServiceResponse> => {
  const parsedRequest = signUpVerifyEmailRequestSchema.parse(request)

  const payload = await decryptToken(parsedRequest.token)
  if (!payload) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  let user = await getUser(payload.userId)
  if (!user) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  if (!user.isEmailVerified) {
    user = await updateUserVerified(user.id)
  }

  await createSession(user)

  return { isSuccess: true }
}

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

const getUser = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  })
}

const updateUserVerified = async (id: number): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { isEmailVerified: true },
  })
}