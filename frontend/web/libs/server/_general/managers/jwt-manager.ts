import 'server-only'
import { base64url, EncryptJWT, jwtDecrypt, JWTPayload } from 'jose'
import { JWTExpired } from 'jose/errors'
import { SessionPayload } from '@/libs/server/_general/models/session-payload'

// config
const secretKey = process.env.JWT_SECRET
if (!secretKey) throw new Error('JWT Secret not set')
const secret = base64url.decode(secretKey)

const algorithm = 'dir'
const encryption = 'A128CBC-HS256'

export type TokenPayload = SessionPayload & JWTPayload

export const issueToken = async (
  payload: TokenPayload,
  expirationTime: string,
): Promise<string> => {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: algorithm, enc: encryption })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .encrypt(secret)
}

export const verifyToken = async (
  token: string,
): Promise<TokenPayload | undefined> => {
  try {
    const { payload } = await jwtDecrypt<TokenPayload>(token, secret)

    return payload
  } catch (error) {
    if (!(error instanceof JWTExpired)) {
      console.error('Unknown JWT verify error. error=', error)
    }
  }
}