import { NextRequest, NextResponse } from 'next/server'
import { Path } from './libs/share/_general/enums/path'

const publicPaths = [
  Path.HOME,
  Path.LOGIN,
]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = publicPaths.some(publicPath => publicPath === path);
  console.log('isPublicPath', isPublicPath)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}