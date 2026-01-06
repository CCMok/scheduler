import 'server-only'
import { Session, sessionSchema } from './session'
import { User } from '@/external/prisma/generated/client'
import { decrypt, encrypt } from '../jwt/jwt-manager'
import { setCookie } from '../cookie/cookie-manager'
import { cookies } from 'next/headers'

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000
const COOKIE_NAME = 'session'

export const createSession = async (user: User) => {
  const expirationTime = new Date(Date.now() + EXPIRATION_TIME)
  const payload: Session = {
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roleId: user.roleId,
  }
  const jwt = await encrypt(payload, expirationTime)
  await setCookie(COOKIE_NAME, jwt, expirationTime)
}

export const getSession = async (): Promise<Session | undefined> => {
  const jwt = (await cookies()).get(COOKIE_NAME)?.value
  if (!jwt) return

  const payload = await decrypt(jwt)
  if (!payload) return

  const parseResult = sessionSchema.safeParse(payload)
  if (!parseResult.success) {
    console.error('Invalid session payload')
    console.error(parseResult.error)
    return
  }
  
  return parseResult.data
}

export const deleteSession = async (): Promise<void> => {
  (await cookies()).delete(COOKIE_NAME)
}

export const refreshSession = async (): Promise<void> => {
  const session = await getSession()
  if (!session) return

  const expirationTime = new Date(Date.now() + EXPIRATION_TIME)
  const jwt = await encrypt(session, expirationTime)
  await setCookie(COOKIE_NAME, jwt, expirationTime)
}