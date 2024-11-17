import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser } from './utils'

import type { JWT } from 'next-auth/jwt'
import type { NextAuthUser } from './types'
import type { NextAuthOptions, Session } from 'next-auth'

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
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    ...user,
                    accessTokenExpires: Date.now() + 60 * 60 * 1000
                }
            }

            if (Date.now() < token.accessTokenExpires) {
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

        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            session.user = token as unknown as NextAuthUser
            return session
        }
    },

    pages: { signIn: '/' },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
}

