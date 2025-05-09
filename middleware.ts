// Export the default middleware from next-auth/middleware.
// This default middleware will protect matched routes and redirect unauthenticated
// users to the sign-in page defined in your `authOptions.pages.signIn`.
export { default } from "next-auth/middleware";

// The `config` object specifies which paths the middleware should apply to.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes, including /api/auth for NextAuth itself)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - /login (your login page)
         * - /signup (your signup page)
         * - /forgot-password (your forgot password page)
         * - / (your public landing page, if you have one at the root)
         *
         * This ensures that public pages and Next.js internals are not protected,
         * while other pages (like /dashboard) will be.
         */
        '/dashboard/:path*', // Protects the main dashboard and any sub-routes
        '/analytics/:path*', // Protects analytics pages
        '/reports/:path*',   // Protects reports pages
        '/content/:path*',   // Protects content management pages
        '/audience/:path*',  // Protects audience insight pages
        '/settings/:path*',  // Protects user settings pages

        // If you have other specific routes that need protection, add them here.
        // For example:
        // '/profile/:path*',
        // '/admin/:path*', // If you have an admin section

        // A more advanced approach to protect all routes except specific public ones:
        // '/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|public-page|$).*)',
        // The `$` at the end of the regex above would protect the root `/` page as well.
        // If your landing page is at `/`, you might want to exclude it explicitly or use a different pattern.
    ],
};

// --- Optional: Advanced Custom Middleware Logic ---
// If you need more complex logic than just redirecting unauthenticated users,
// you can define a custom middleware function.
/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Paths that require authentication
  const protectedPaths = [
    '/dashboard',
    '/analytics',
    '/reports',
    '/content',
    '/audience',
    '/settings',
  ];

  const isPathProtected = protectedPaths.some(path => pathname.startsWith(path));

  // If the path is protected and there's no token (user is not authenticated)
  if (isPathProtected && !token) {
    // Redirect to the login page
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); // Pass the original path as callbackUrl
    return NextResponse.redirect(loginUrl);
  }

  // Example: Role-based access control
  // if (pathname.startsWith('/admin') && token?.role !== 'admin') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirect to an unauthorized page
  // }

  // If none of the above conditions are met, continue to the requested page
  return NextResponse.next();
}

// Apply this custom middleware to the same paths
// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/analytics/:path*',
//     // ... other protected paths
//   ],
// };
*/