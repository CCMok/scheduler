import 'server-only'
import { issueToken, TokenPayload, verifyToken } from "../../_general/managers/jwt-manager";
import { UserExcludePasswordWithRole } from "../../user/models/user-dao";
import { SessionPayload } from "../models/session-payload";
import { deleteCookie, getCookie, setCookie } from '../../_general/managers/cookie-manager';
import { LOGIN_SESSION_EXPIRATION_TIME } from '../constants/token-constant';

// config
const cookieName = 'token';

export const setSession = async (userRole: UserExcludePasswordWithRole): Promise<void> => {
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
  const token = await issueToken(tokenPayload, LOGIN_SESSION_EXPIRATION_TIME);
  await setCookie(cookieName, token);
}

export const getSessionPayloadFromUserRole = (userRole: UserExcludePasswordWithRole): SessionPayload => {
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