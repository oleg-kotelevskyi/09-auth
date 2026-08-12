import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!accessToken && refreshToken) {
    if (isPrivateRoute || isPublicRoute) {
      try {
        const refreshResponse = await fetch(new URL('/api/auth/session', request.url), {
          headers: {
            Cookie: `refreshToken=${refreshToken.value}`,
          },
          cache: 'no-store',
        });

        if (refreshResponse.ok) {
          const nextResponse = isPublicRoute 
            ? NextResponse.redirect(new URL('/', request.url))
            : NextResponse.next();

          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            nextResponse.headers.set('set-cookie', setCookieHeader);
          }
          return nextResponse;
        }
      } catch (error) {
        console.error('Failed to refresh session in proxy:', error);
      }

      const badAuthResponse = NextResponse.redirect(new URL('/sign-in', request.url));
      badAuthResponse.cookies.delete('accessToken');
      badAuthResponse.cookies.delete('refreshToken');
      return badAuthResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};


