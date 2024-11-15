// src\app\api\auth\[...nextauth]\route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { userSchema } from '@/lib/dms/schema'
import { NextAuthOptions, DefaultSession } from 'next-auth'

/**
 * Interface for the login response from the authentication API.
 */
interface LoginResponse {
    message: string
    token: string
}

/**
 * Type defining the structure of an authenticated user.
 */
type NextAuthUser = z.infer<typeof userSchema> & {
    id: string
    accessToken: string
}

declare module 'next-auth' {
    /**
     * Extending the Session interface to include user details.
     */
    interface Session {
        user: NextAuthUser & DefaultSession['user']
    }

    /**
     * mar note:
     * If you want to extend the User interface to include NextAuthUser structure.
     * 
     * use this:
     * interface User extends NextAuthUser {}
     */
}

declare module 'next-auth/jwt' {
    /**
     * Extending the JWT interface to include additional properties.
     */
    interface JWT extends NextAuthUser {
        accessTokenExpires: number
    }
}

/**
 * Fetches protected user details using the provided access token.
 * 
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<NextAuthUser>} - The authenticated user's details.
 * @throws {Error} - If the fetch fails or the response is invalid.
 */
async function fetchProtectedUserDetails(accessToken: string): Promise<NextAuthUser> {
    const response = await fetch(process.env.API_AUTH_PROTECTED as string, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorDetails = await response.text()
        console.error('Failed to fetch protected user details:', errorDetails)
        throw new Error('Failed to fetch protected user details.')
    }

    const userDetails = await response.json()
    const validatedUser = userSchema.parse(userDetails)

    return {
        ...validatedUser,
        id: validatedUser.user_id,
        email: validatedUser.email as string & z.BRAND<'unique'>,
        accessToken
    }
}

/**
 * Attempts to authenticate a user with the given credentials.
 * 
 * @param {string} identifier - The user's identifier (username or email).
 * @param {string} password - The user's password.
 * @returns {Promise<NextAuthUser | null>} - The authenticated user's details, or null if unsuccessful.
 * @throws {Error} - If login fails or the server response is invalid.
 */
async function loginUser(identifier: string, password: string): Promise<NextAuthUser | null> {
    const response = await fetch(process.env.API_AUTH_LOGIN as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
        cache: 'no-store',
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text()
        console.error('Unexpected response format:', errorText)
        throw new Error('The server returned an invalid response format. Please contact support.')
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }))
        console.error('Authentication failed:', errorData)
        throw new Error(errorData.message || 'Authentication failed')
    }

    const data: LoginResponse = await response.json()
    if (!data.token) {
        console.error('Invalid response data:', data)
        throw new Error(data.message || 'Invalid response data from the server.')
    }

    return await fetchProtectedUserDetails(data.token)
}

/**
 * Configuration options for NextAuth, including providers and callbacks.
 * 
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error('Please enter both username and password')
                }
                return await loginUser(credentials.identifier, credentials.password)
            }
        }),
    ],

    callbacks: {
        /**
         * Callback to manage JWT tokens.
         * 
         * @param {Object} param - Parameters containing token and user information.
         * @param {JWT} param.token - The current JWT token.
         * @param {User} param.user - The authenticated user, if present.
         * @returns {Promise<JWT>} - The updated token.
         */
        async jwt({ token, user }) {
            if (user) {
                return { ...token, ...user, accessTokenExpires: Date.now() + 60 * 60 * 1000 }
            }

            // Return token early if not expired
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            try {
                const refreshedToken = await fetch(process.env.API_AUTH_REFRESH_TOKEN as string, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                // Handle 401 specifically
                if (refreshedToken.status === 401) {
                    return { ...token, error: 'TokenExpiredError' }
                }

                if (!refreshedToken.ok) {
                    throw new Error(`Token refresh failed: ${refreshedToken.status}`)
                }

                const refreshedData = await refreshedToken.json()
                return {
                    ...token,
                    accessToken: refreshedData.token,
                    accessTokenExpires: Date.now() + 60 * 60 * 1000
                }
            } catch (error) {
                console.error('Error refreshing token:', error)
                return { ...token, error: 'RefreshTokenError' }
            }
        },

        /**
         * Callback to include user information in the session object.
         * 
         * @param {Object} param - Parameters containing session and token information.
         * @param {Session} param.session - The session object.
         * @param {JWT} param.token - The current JWT token.
         * @returns {Promise<Session>} - The updated session with user details.
         */
        async session({ session, token }) {
            session.user = token as unknown as NextAuthUser
            return session
        },
    },

    pages: { signIn: '/' },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    debug: false,
}

/**
 * NextAuth API route handler.
 */
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
