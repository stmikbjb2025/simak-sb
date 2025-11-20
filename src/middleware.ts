import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Specify protected and public routes
  const publicRoutes = ['/', '/sign-in'];

  // 2. Check if the current route is protected or public
  const isProtectedRoute = !publicRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // 3. Get the session from the cookie
  const getSessionFromCookie = req.cookies.get('session')?.value;

  // 4. Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !getSessionFromCookie) {
    const loginUrl = new URL('/sign-in', req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Redirect to /dashboard if the user is authenticated and trying to access a public route
  if (isPublicRoute && getSessionFromCookie) {
    const dashboardUrl = new URL('/admin', req.nextUrl);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}