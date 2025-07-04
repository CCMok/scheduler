import 'server-only'
import { cookies } from 'next/headers'

export const setCookie = async (key: string, value: string): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(key, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })
}

export const getCookie = async (key: string): Promise<string | undefined> => {
  const cookiesStore = await cookies();
  const cookie = cookiesStore.get(key);

  return cookie?.value;
}

export const deleteCookie = async (key: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}