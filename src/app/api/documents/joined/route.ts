// src/app/api/documents/joined/route.ts
import { NextResponse } from 'next/server'
import { debugFileExists, getCachedJoinedDocuments } from '@/lib/services/joined-documents/documents.server'

export async function GET() {
    try {
        // First check if files exist
        const fileStatus = await debugFileExists()
        console.log('File status:', fileStatus)
        
        const documents = await getCachedJoinedDocuments()
        console.log('Document is:')
        console.table(documents)
        return NextResponse.json(documents)
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        )
    }
}