import { NextRequest, NextResponse } from 'next/server'
import { Path } from './libs/share/_general/enums/path'
import { deleteSession, getSession } from './libs/server/_general/manager/session-manager';
import { SessionPayload } from './libs/server/_general/models/session-payload';

const publicPaths = [
  Path.LOGIN,
]

const redirectPublicPath = Path.LOGIN;
const redirectPrivatePath = Path.DASHBOARD;

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPrivatePath = checkIsPrivatePath(path);
  const sessionPayload = await getSession();

  if (isPrivatePath) {
    return await handlePrivatePath(request, sessionPayload)
  }

  return handlePublicPath(request, sessionPayload)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.ico$|.*\\.png$).*)'],
}

const checkIsPrivatePath = (path: string): boolean => {
  if (path === Path.HOME) return false;

  return !publicPaths.some(publicPath => path.startsWith(publicPath));
}

const handlePrivatePath = async (request: NextRequest, sessionPayload: SessionPayload | undefined): Promise<NextResponse> => {
  if (sessionPayload) {
    return NextResponse.next()
  }

  await deleteSession();
  return NextResponse.redirect(new URL(redirectPublicPath, request.url))
}

const handlePublicPath = (request: NextRequest, sessionPayload: SessionPayload | undefined): NextResponse => {
  if (sessionPayload) {
    return NextResponse.redirect(new URL(redirectPrivatePath, request.url))
  }

  return NextResponse.next()
}