// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getCachedUsers } from '@/lib/services/users'

export async function GET() {
    try {
        const users = await getCachedUsers()
        return NextResponse.json(users)
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
