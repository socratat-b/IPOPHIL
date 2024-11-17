import type { ExtendedUser } from '@/lib/dms/schema'

export type NextAuthUser = ExtendedUser & {
    id: string
    accessToken: string
}

declare module 'next-auth' {
    interface Session {
        user: NextAuthUser
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends NextAuthUser {
        accessTokenExpires: number
        error?: 'TokenExpiredError' | 'RefreshTokenError'
    }
}
