import 'server-only'
import { issueToken } from "./jwt-manager";
import { UserRole } from "../../user/models/user-models";
import { SessionPayload } from "../models/session-payload";
import { setCookie } from './cookie-manager';

// config
const sessionExpirationTime = '1h';
const cookieName = 'token';

export const setSession = async (userRole: UserRole): Promise<void> => {
  const sessionPayload = getSessionPayload(userRole);

  const token = await issueToken(sessionPayload, sessionExpirationTime);

  await setCookie(cookieName, token);
}

const getSessionPayload = (userRole: UserRole): SessionPayload => {
  return {
    userId: userRole.id,
    email: userRole.email,
    roleEnum: userRole.role.enum,
    name: userRole.name ?? undefined,
  }
}