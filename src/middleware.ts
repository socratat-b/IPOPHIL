// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow access to session route without a token
                return !!token || req.nextUrl.pathname === '/api/auth/session';
            },
        },
        pages: {
            signIn: '/',
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/((?!auth).*)',  // Protect API routes except auth routes
    ],
};
