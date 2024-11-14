// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getCachedUsers } from '@/lib/services/users'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const users = await getCachedUsers()
        return NextResponse.json(users)

    } catch (error) {
        console.error('API error:', error)

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message === 'Authentication required') {
                return NextResponse.json(
                    { error: 'Authentication required' },
                    { status: 401 }
                )
            }

            if (error.message.includes('API error: 403')) {
                return NextResponse.json(
                    { error: 'Access forbidden' },
                    { status: 403 }
                )
            }
        }

        // Generic error response
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Optional: Add CORS headers for API routes
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}