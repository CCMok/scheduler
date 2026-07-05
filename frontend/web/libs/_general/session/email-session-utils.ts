import { User } from "@/external/prisma/generated/client";
import { encrypt } from "../jwt/jwt-manager";
import { getSessionPayload } from "./session-manager";

const EXPIRATION_TIME = '15m'

export const BASE_URL = (() => {
  if (process.env.SITE_DOMAIN) {
    return `https://${process.env.SITE_DOMAIN}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
})()

export const createToken = async (
  user: User,
): Promise<string> => {
  const payload = getSessionPayload(user)
  return await encrypt(payload, EXPIRATION_TIME)
}