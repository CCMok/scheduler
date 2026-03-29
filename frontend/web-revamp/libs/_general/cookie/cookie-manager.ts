import 'server-only'
import { cookies } from "next/headers"
import { ROUTE } from '../route/route-config'

export enum CookieName {
  SESSION = 'session',
}

export const setCookie = async (key: string, value: string, expires?: Date) => {
  const cookieStore = await cookies()

  cookieStore.set(key, value, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: ROUTE.public.home,
  })
}