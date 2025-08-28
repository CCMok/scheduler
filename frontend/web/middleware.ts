import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getSession, refreshSession } from './libs/server/_general/managers/session-manager';
import { SessionPayload } from './libs/server/_general/models/session-payload';
import { EXCLUDE_HOME_PUBLIC_PATHS, PATH, REDIRECT_PRIVATE_PATH, REDIRECT_PUBLIC_PATH } from './libs/share/_general/utils/path';
import { isAccessable } from './libs/server/access/services/route-access-service';

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
    // Check if user has access to this specific path
    const hasAccess = await isAccessable(path);
    
    if (hasAccess) {
      await refreshSession(sessionPayload)
      return NextResponse.next()
    } else {
      // User doesn't have permission for this path, redirect to dashboard
      await refreshSession(sessionPayload)
      return NextResponse.redirect(new URL(REDIRECT_PRIVATE_PATH, request.url))
    }
  }

  await deleteSession();
  return NextResponse.redirect(new URL(REDIRECT_PUBLIC_PATH, request.url))
}

const handlePublicPath = (request: NextRequest, sessionPayload: SessionPayload | undefined): NextResponse => {
  if (sessionPayload) {
    return NextResponse.redirect(new URL(REDIRECT_PRIVATE_PATH, request.url))
  }

  return NextResponse.next()
}