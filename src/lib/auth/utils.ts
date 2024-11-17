import { extendedUserSchema } from '@/lib/dms/schema'

import type { NextAuthUser } from './types'

export async function fetchProtectedUserDetails(accessToken: string): Promise<NextAuthUser> {
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
    const validatedUser = extendedUserSchema.parse(userDetails)

    return {
        ...validatedUser,
        id: validatedUser.user_id,
        accessToken
    }
}

export async function loginUser(identifier: string, password: string): Promise<NextAuthUser | null> {
    const response = await fetch(process.env.API_AUTH_LOGIN as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
        cache: 'no-store',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }))
        throw new Error(errorData.message || 'Authentication failed')
    }

    const data = await response.json()
    if (!data.token) {
        throw new Error('Invalid response data from the server.')
    }

    return await fetchProtectedUserDetails(data.token)
}
