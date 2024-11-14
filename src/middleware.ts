// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuthPage = req.nextUrl.pathname === '/'

        // Redirect authenticated users trying to access the root/login page
        if (isAuthPage && token) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Redirect unauthenticated users trying to access protected routes
        if (!isAuthPage && !token) {
            return NextResponse.redirect(new URL('/', req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Always allow access to root page and session endpoint
                if (req.nextUrl.pathname === '/' ||
                    req.nextUrl.pathname === '/api/auth/session') {
                    return true
                }
                // Require token for all other routes
                return !!token
            },
        },
        pages: {
            signIn: '/',
        },
    }
)

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/api/((?!auth).*)',
    ],
}