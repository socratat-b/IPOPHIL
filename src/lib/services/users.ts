// src/lib/services/users.ts
import { compareDesc } from 'date-fns'
import { unstable_cache } from 'next/cache'
import { extendedUserSchema, type ExtendedUser } from '@/lib/dms/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const CACHE_TAG = 'users'
const REVALIDATE_TIME = 3600
const API_URL = 'https://ipophl.quanby-staging.com/api'

export const getUsers = async (): Promise<ExtendedUser[]> => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.accessToken) {
            throw new Error('Authentication required')
        }

        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const data = await response.json()

        // Parse the response data with the extended schema
        const users = extendedUserSchema.array().parse(data.map((user: any) => ({
            ...user,
            // Ensure agency_name is explicitly set as null if not present
            agency_name: user.agency_name ?? null,
            created_at: new Date(user.created_at).toISOString(),
            updated_at: user.updated_at ? new Date(user.updated_at).toISOString() : null,
            deleted_at: user.deleted_at ? new Date(user.deleted_at).toISOString() : null,
        })))

        return users.sort((a, b) => compareDesc(
            new Date(a.created_at),
            new Date(b.created_at)
        ))
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', JSON.stringify(error.errors, null, 2))
        }
        console.error('Failed to fetch users:', error)
        throw error
    }
}

export const getCachedUsers = unstable_cache(
    getUsers,
    [CACHE_TAG],
    {
        revalidate: REVALIDATE_TIME,
        tags: [CACHE_TAG]
    }
)

// Export the type for use in components
export type { ExtendedUser }