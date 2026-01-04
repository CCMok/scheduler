import 'server-only'
import { cookies } from "next/headers"
import { Path } from '../path/path'

export const setCookie = async (key: string,value: string, expires?: Date) => {
  const cookieStore = await cookies()
 
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: Path.HOME,
  })
}