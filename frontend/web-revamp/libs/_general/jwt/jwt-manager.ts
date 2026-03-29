import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const ENCODED_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const ALGORITHM = 'HS256'

export const encrypt = async (payload: JWTPayload, expirationTime: number | string | Date): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(ENCODED_SECRET)
}
 
export const decrypt = async (jwt: string | Uint8Array): Promise<JWTPayload | undefined> => {
  try {
    const { payload } = await jwtVerify(jwt, ENCODED_SECRET, {
      algorithms: [ALGORITHM],
    })
    return payload
  } catch (error) {
    console.info('Failed to verify JWT')
    console.info(error)
  }
}