import 'server-only'
import { SessionPayload, sessionPayloadSchema } from './session'
import { User } from '@/external/prisma/generated/client'
import { decrypt, encrypt } from '../jwt/jwt-manager'
import { CookieName, setCookie } from '../cookie/cookie-manager'
import { cookies } from 'next/headers'

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000

export const createSession = async (user: User) => {
  const expirationTime = new Date(Date.now() + EXPIRATION_TIME)
  const payload = getSessionPayload(user)
  const jwt = await encrypt(payload, expirationTime)
  await setCookie(CookieName.SESSION, jwt, expirationTime)
}

export const getSession = async (): Promise<SessionPayload | undefined> => {
  const jwt = (await cookies()).get(CookieName.SESSION)?.value
  if (!jwt) return

  const payload = await decrypt(jwt)
  if (!payload) return

  const parseResult = sessionPayloadSchema.safeParse(payload)
  if (!parseResult.success) {
    console.error('Invalid session payload')
    console.error(parseResult.error)
    return
  }
  
  return parseResult.data
}

export const deleteSession = async (): Promise<void> => {
  (await cookies()).delete(CookieName.SESSION)
}

export const refreshSession = async (): Promise<void> => {
  const session = await getSession()
  if (!session) return

  const expirationTime = new Date(Date.now() + EXPIRATION_TIME)
  const jwt = await encrypt(session, expirationTime)
  await setCookie(CookieName.SESSION, jwt, expirationTime)
}

export const getSessionPayload = (user: User): SessionPayload => {
  return {
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    role: user.role,
  }
}