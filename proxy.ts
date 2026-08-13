import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

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

          const setCookieHeaders = refreshResponse.headers.getSetCookie();
          
          if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookieStr) => {
              const parsed = parseSetCookie(cookieStr);
              
              const cookiesArray = Array.isArray(parsed) ? parsed : [parsed];

              cookiesArray.forEach((cookieItem) => {
                const { name, value, path, maxAge, httpOnly, secure } = cookieItem;

                if (!name) return;

                const options: {
                  httpOnly?: boolean;
                  path?: string;
                  secure?: boolean;
                  maxAge?: number;
                } = {
                  httpOnly,
                  path: path || '/',
                  secure,
                };

                if (maxAge !== undefined) {
                  options.maxAge = maxAge;
                }

                nextResponse.cookies.set(name, value, options);
              });
            });
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







