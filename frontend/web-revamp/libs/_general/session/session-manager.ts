import 'server-only'
import { SessionPayload } from './session-payload'
import { cookies } from 'next/headers'
import { User } from '@/external/prisma/generated/client'
import { encrypt } from './jwt-manager'

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000

export async function createSession(user: User) {
  const expirationTime = new Date(Date.now() + EXPIRATION_TIME)
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
  }
  const jwt = await encrypt(payload, expirationTime)
  const cookieStore = await cookies()
 
  cookieStore.set('session', jwt, {
    httpOnly: true,
    secure: true,
    expires: expirationTime,
    sameSite: 'lax',
    path: '/',
  })
}