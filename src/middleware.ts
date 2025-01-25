import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isProtectedPage = request.nextUrl.pathname === '/profile' || 
                         request.nextUrl.pathname === '/messages' || 
                         request.nextUrl.pathname === '/matches';

  // Giriş yapılmamışsa ve korumalı sayfaya erişmeye çalışıyorsa
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Giriş yapılmışsa ve auth sayfalarına erişmeye çalışıyorsa
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin sayfası kontrolü
  if (isAdminPage) {
    const isAdmin = request.cookies.get('isAdmin');
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/messages',
    '/matches',
    '/admin/:path*',
    '/login',
    '/register'
  ],
}; 