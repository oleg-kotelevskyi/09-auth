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

          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          
          if (setCookieHeader) {
            const cookieStrings = setCookieHeader.split(/,(?=[^;]*=)/).map(s => s.trim());

            cookieStrings.forEach((cookieStr) => {
              const cookieItem = parseSetCookie(cookieStr);
              if (!cookieItem || !cookieItem.name) return;

              const options: {
                httpOnly?: boolean;
                path?: string;
                secure?: boolean;
                maxAge?: number;
              } = {
                httpOnly: cookieItem.httpOnly,
                path: cookieItem.path || '/',
                secure: cookieItem.secure,
              };

              if (cookieItem.maxAge !== undefined) {
                options.maxAge = cookieItem.maxAge;
              }

              const targetValue = cookieItem.value || '';
              nextResponse.cookies.set(cookieItem.name, targetValue, options);
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
















