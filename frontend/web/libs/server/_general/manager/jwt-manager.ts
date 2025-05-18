import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { JWTExpired } from 'jose/errors';
import { SessionPayload } from '@/libs/server/_general/models/session-payload'

// config
const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error('JWT Secret not set')
const encodedKey = new TextEncoder().encode(secretKey);

const algorithm = 'HS256';

export type TokenPayload = SessionPayload & JWTPayload

export const issueToken = async (payload: TokenPayload, expirationTime: string): Promise<string> =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedKey)

export const verifyToken = async (token: string): Promise<TokenPayload | undefined> => {
  try {
    const verifyResult = await jwtVerify<TokenPayload>(
      token,
      encodedKey,
      { algorithms: [algorithm] }
    )

    return verifyResult.payload;
  } catch (error) {
    if (!(error instanceof JWTExpired)) {
      console.error('Unknown JWT verify error. error=', error);
    }
  }
}