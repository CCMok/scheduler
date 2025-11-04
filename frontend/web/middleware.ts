import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getSession, refreshSession } from './libs/access/managers/session-manager';
import { SessionPayload } from './libs/access/models/session-payload';
import { EXCLUDE_HOME_PUBLIC_PATHS, PATH, REDIRECT_PRIVATE_PATH, REDIRECT_PUBLIC_PATH } from './libs/_general/enums/path';
import { checkCanAccess } from './libs/access/utils/route-access-utils';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPrivatePath = checkIsPrivatePath(path);
  const sessionPayload = await getSession();

  if (isPrivatePath) {
    return await handlePrivatePath(request, sessionPayload, path)
  }

  return handlePublicPath(request, sessionPayload)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.ico$|.*\\.png$).*)'],
}

const checkIsPrivatePath = (path: string): boolean => {
  if (path === PATH.home) return false;

  return !EXCLUDE_HOME_PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
}

const handlePrivatePath = async (request: NextRequest, sessionPayload: SessionPayload | undefined, path: string): Promise<NextResponse> => {
  if (sessionPayload) {
    await refreshSession(sessionPayload)
    return await checkAuthorized(request, path)
  }

  await deleteSession();
  return NextResponse.redirect(new URL(REDIRECT_PUBLIC_PATH, request.url))
}

const checkAuthorized = async (request: NextRequest, path: string) => {
  const hasAccess = await checkCanAccess(path);
  return hasAccess
    ? NextResponse.next()
    : NextResponse.redirect(new URL(REDIRECT_PRIVATE_PATH, request.url))
}

const handlePublicPath = (request: NextRequest, sessionPayload: SessionPayload | undefined): NextResponse =>
  sessionPayload
    ? NextResponse.redirect(new URL(REDIRECT_PRIVATE_PATH, request.url))
    : NextResponse.next()
