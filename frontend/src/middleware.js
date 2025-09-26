import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token and user from cookies
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Admin routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Protected user routes (require authentication)
  // Only these routes require auth, others like /dashboard, /shop, /orders are public
  const protectedUserRoutes = ['/profil', '/cart', '/payment-methods'];
  const isProtectedUserRoute = protectedUserRoutes.some(route => pathname.startsWith(route));

  // If accessing root path, redirect based on role
  if (pathname === '/') {
    if (token && user) {
      if (user.user_level === 'Admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (user.user_level === 'Pengguna') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected routes
  if (!token && (isAdminRoute || isProtectedUserRoute)) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
    // Alternatively, to show 404 instead of redirect, uncomment below:
    // return new Response('Not Found', { status: 404 });
  }

  // If authenticated but wrong role
  if (token && user) {
    if (isAdminRoute && user.user_level !== 'Admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isProtectedUserRoute && user.user_level !== 'Pengguna') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // If authenticated and accessing login/register, redirect to appropriate dashboard
  if (token && user && isPublicRoute) {
    if (user.user_level === 'Admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (user.user_level === 'Pengguna') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }d
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
