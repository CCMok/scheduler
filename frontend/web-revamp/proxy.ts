import { NextRequest, NextResponse } from "next/server";
import { REDIRECT_PRIVATE_PATH, PUBLIC_PATH_EXCLUDE_HOME, REDIRECT_PUBLIC_PATH, Path } from "./libs/_general/path/path";
import { getSession, refreshSession } from "./libs/_general/session/session-manager";

export default async function proxy(req: NextRequest) {
  const isPublicPath = checkIsPublicPath(req.nextUrl.pathname);
  const session = await getSession()

  if (session) {
    await refreshSession()
  }

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL(REDIRECT_PRIVATE_PATH, req.url))
  }

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL(REDIRECT_PUBLIC_PATH, req.url))
  }

  return NextResponse.next()
}

const checkIsPublicPath = (path: string): boolean => {
  return PUBLIC_PATH_EXCLUDE_HOME.some(publicPath => 
    path === Path.HOME || path.startsWith(publicPath)
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*devtools.*|.*\\.ico$|.*\\.png$).*)'],
}