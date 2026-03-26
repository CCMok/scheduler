import { NextRequest, NextResponse } from "next/server";
import { getSession, refreshSession } from "./libs/_general/session/session-manager";
import { PUBLIC_ROUTE_EXCLUDE_HOME, REDIRECT_PRIVATE_ROUTE, REDIRECT_PUBLIC_ROUTE, ROUTE } from "./libs/_general/route/route";

export default async function proxy(req: NextRequest) {
  const isPublicPath = checkIsPublicPath(req.nextUrl.pathname);
  const session = await getSession()

  if (session) {
    await refreshSession()
  }

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL(REDIRECT_PRIVATE_ROUTE, req.url))
  }

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL(REDIRECT_PUBLIC_ROUTE, req.url))
  }

  return NextResponse.next()
}

const checkIsPublicPath = (path: string): boolean => {
  return PUBLIC_ROUTE_EXCLUDE_HOME.some(publicRoute => 
    path === ROUTE.public.home || path.startsWith(publicRoute)
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*devtools.*|.*\\.ico$|.*\\.png$).*)'],
}