import { NextResponse } from 'next/server'
import { getCachedDocumentTypes } from '@/lib/services/document-types'

export async function GET() {
    try {
        const documentTypes = await getCachedDocumentTypes()
        return NextResponse.json(documentTypes)
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error fetching document types'
            },
            { status: 500 }
        )
    }
}