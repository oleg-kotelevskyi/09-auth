import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

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
              const parts = cookieStr.split(';').map(p => p.trim());
              if (parts.length === 0) return;

              const firstPart = parts[0];
              const equalIndex = firstPart.indexOf('=');
              if (equalIndex === -1) return;

              const cookieName = firstPart.substring(0, equalIndex).trim();
              const cookieValue = firstPart.substring(equalIndex + 1).trim();

              if (!cookieName || ['path', 'expires', 'domain', 'max-age', 'secure', 'httponly', 'samesite'].includes(cookieName.toLowerCase())) {
                return;
              }

              const options: {
                httpOnly?: boolean;
                path?: string;
                secure?: boolean;
                maxAge?: number;
              } = {
                httpOnly: cookieStr.toLowerCase().includes('httponly'),
                path: '/',
                secure: cookieStr.toLowerCase().includes('secure'),
              };

              parts.forEach((part) => {
                const lowerPart = part.toLowerCase();
                if (lowerPart.startsWith('path=')) {
                  options.path = part.substring(5).trim();
                }
                if (lowerPart.startsWith('max-age=')) {
                  options.maxAge = parseInt(part.substring(8).trim(), 10);
                }
              });

              nextResponse.cookies.set(cookieName, cookieValue, options);
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





