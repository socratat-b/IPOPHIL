'use client'

import useSWR from 'swr/immutable'
import { useSession } from 'next-auth/react'
import { compareDesc } from 'date-fns'
import { z } from 'zod'
import { extendedUserSchema } from '../dms/schema'

export type ExtendedUser = z.infer<typeof extendedUserSchema>

export function useUsers() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<ExtendedUser[]>(
        session?.user ? '/api/users' : null,
        async (url) => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message || 'Failed to fetch users')
                }

                const data = await res.json()

                // Parse and validate the response data
                const users = extendedUserSchema.array().parse(
                    data.map((user: ExtendedUser) => ({
                        ...user,
                        agency_name: user.agency_name ?? null,
                        created_at: new Date(user.created_at).toISOString(),
                        updated_at: user.updated_at ? new Date(user.updated_at).toISOString() : null,
                    }))
                )

                // Sort users by creation date
                return users.sort((a, b) => compareDesc(
                    new Date(a.created_at),
                    new Date(b.created_at)
                ))
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.error('Validation error:', JSON.stringify(error.errors, null, 2))
                }
                throw error
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        users: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}