import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!sessionCookie) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  try {
    const response = await fetch('https://goit.study', {
      headers: {
        Cookie: `session=${sessionCookie.value}`,
      },
      cache: 'no-store',
    });

    const isAuthenticated = response.ok && response.status === 200;

    if (isAuthenticated) {
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } else {
      if (isPrivateRoute) {
        const nextResponse = NextResponse.redirect(new URL('/sign-in', request.url));
        nextResponse.cookies.delete('session');
        return nextResponse;
      }
    }
  } catch (error) {
    console.error('Proxy validation error:', error);
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

