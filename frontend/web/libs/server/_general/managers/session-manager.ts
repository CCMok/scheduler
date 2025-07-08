import 'server-only'
import { issueToken, TokenPayload, verifyToken } from "./jwt-manager";
import { UserRole } from "../../user/models/user-models";
import { SessionPayload } from "../models/session-payload";
import { deleteCookie, getCookie, setCookie } from './cookie-manager';

// config
const sessionExpirationTime = '1d';
const cookieName = 'token';

export const setSession = async (userRole: UserRole): Promise<void> => {
  const sessionPayload = getSessionPayloadFromUserRole(userRole);
  await issueTokenSetCookie(sessionPayload)
}

export const getSession = async (): Promise<SessionPayload | undefined> => {
  const token = await getCookie(cookieName)
  if (!token) return;

  const tokenPayload = await verifyToken(token)
  if (!tokenPayload) return;

  return getSessionPayloadFromTokenPayload(tokenPayload);
}

export const deleteSession = async (): Promise<void> => {
  await deleteCookie(cookieName);
}

export const refreshSession = async (sessionPayload: SessionPayload): Promise<void> => {
  await issueTokenSetCookie(sessionPayload)
}

const issueTokenSetCookie = async (tokenPayload: TokenPayload): Promise<void> => {
  const token = await issueToken(tokenPayload, sessionExpirationTime);
  await setCookie(cookieName, token);
}

const getSessionPayloadFromUserRole = (userRole: UserRole): SessionPayload => {
  return {
    userId: userRole.id,
    email: userRole.email,
    roleEnum: userRole.role.enum,
    name: userRole.name ?? undefined,
  }
}

const getSessionPayloadFromTokenPayload = (tokenPayload: TokenPayload): SessionPayload => {
  return {
    userId: tokenPayload.userId,
    email: tokenPayload.email,
    roleEnum: tokenPayload.roleEnum,
    name: tokenPayload.name,
  }
}