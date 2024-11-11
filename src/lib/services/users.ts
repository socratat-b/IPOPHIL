// src/lib/services/users.ts
import path from 'path'
import { promises as fs } from 'fs'
import { compareDesc } from 'date-fns'
import { unstable_cache } from 'next/cache'
import { userSchema } from '@/lib/dms/schema'

// Types
export type User = typeof userSchema._type

// Service Constants
const CACHE_TAG = 'users'
const REVALIDATE_TIME = 3600 // 1 hour
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Server-side data fetching (for API routes)
export const getUsers = async () => {
    try {
        const query = await fs.readFile(
            path.join(process.cwd(), '/dist/lib/dms/data/users.json')
        )
        const users = userSchema.array().parse(JSON.parse(query.toString()))
        return users.sort((a, b) => compareDesc(new Date(a.created_at), new Date(b.created_at)))
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch users from database')
    }
}

// Cached database query (for API routes)
export const getCachedUsers = unstable_cache(
    getUsers,
    [CACHE_TAG],
    {
        revalidate: REVALIDATE_TIME,
        tags: [CACHE_TAG]
    }
)
