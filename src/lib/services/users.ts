// src/lib/services/users.ts

import { compareDesc } from 'date-fns'
import { unstable_cache } from 'next/cache'
import { userSchema } from '@/lib/dms/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Types
/**
 * @type {User}
 * Type definition for User based on the userSchema. Represents a user entity
 * with properties as defined in the Zod schema.
 */
export type User = typeof userSchema._type

// Service Constants
/**
 * @constant {string} CACHE_TAG
 * Tag used for cache referencing to uniquely identify this cache entry.
 */
const CACHE_TAG = 'users'

/**
 * @constant {number} REVALIDATE_TIME
 * Time in seconds for cache revalidation. Set to 1 hour (3600 seconds).
 */
const REVALIDATE_TIME = 3600

/**
 * @constant {string} API_URL
 * Base URL for the external API endpoint used for fetching user data.
 */
const API_URL = 'https://ipophl.quanby-staging.com/api'

// Server-side data fetching with authentication
/**
 * @function getUsers
 * Fetches and returns a sorted list of users from the external API.
 *
 * - Authenticates the request using the server session token.
 * - Sorts users by their creation date in descending order.
 * - Validates fetched data against the userSchema for consistency.
 *
 * @returns {Promise<User[]>} Array of User objects.
 * @throws Will throw an error if authentication fails or the API call is unsuccessful.
 */
export const getUsers = async () => {
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
            next: {
                revalidate: 0
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const data = await response.json()
        const users = userSchema.array().parse(data)

        return users.sort((a, b) => compareDesc(
            new Date(a.created_at),
            new Date(b.created_at)
        ))
    } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error instanceof Error ? error : new Error('Failed to fetch users')
    }
}

// Cached API query with authentication
/**
 * @function getCachedUsers
 * Fetches and caches the user data using the unstable_cache function.
 * Caches user data for REVALIDATE_TIME duration, providing faster repeated access.
 *
 * - Uses the `getUsers` function for fetching.
 * - Applies cache tag for easy invalidation if needed.
 *
 * @returns {Promise<User[]>} Cached array of User objects.
 */
export const getCachedUsers = unstable_cache(
    getUsers,
    [CACHE_TAG],
    {
        revalidate: REVALIDATE_TIME,
        tags: [CACHE_TAG]
    }
)
