import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from './session-payload'

const ENCODED_SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET)
const ALGORITHM = 'HS256'

export const encrypt = async (payload: SessionPayload, expirationTime: number | string | Date): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(ENCODED_SESSION_SECRET)
}
 
export const decrypt = async (session: string | undefined = ''): Promise<SessionPayload | undefined> => {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, ENCODED_SESSION_SECRET, {
      algorithms: [ALGORITHM],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session')
    console.error(error)
  }
}