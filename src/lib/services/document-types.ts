// src/lib/services/document-types.ts
import path from 'path'
import { promises as fs } from 'fs'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { documentTypesSchema } from '@/lib/dms/schema'

// Types
export type DocumentType = typeof documentTypesSchema._type

// Service Constants
const CACHE_TAG = 'document-types'
const REVALIDATE_TIME = 3600 // 1 hour
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Server-side data fetching (for API routes)
export const getDocumentTypesFromDatabase = async () => {
    try {
        const query = await fs.readFile(
            path.join(process.cwd(), 'dist/lib/dms/data/documentTypes.json')
        )
        return documentTypesSchema.array().parse(JSON.parse(query.toString()))
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch document types from database')
    }
}

// Cached database query (for API routes)
export const getCachedDocumentTypes = unstable_cache(
    getDocumentTypesFromDatabase,
    [CACHE_TAG],
    {
        revalidate: REVALIDATE_TIME,
        tags: [CACHE_TAG]
    }
)

// Client query hook (for pages/components)
export const getDocumentTypes = cache(async () => {
    const res = await fetch(`${BASE_URL}/document-types`, {
        cache: 'force-cache',
        next: { revalidate: REVALIDATE_TIME }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch document types: ${res.statusText}`)
    }

    const data = await res.json()
    return documentTypesSchema.array().parse(data)
})

// mar-note: This is Optional only *Add mutation functions
export async function createDocumentType(typeData: Partial<DocumentType>) {
    const res = await fetch(`${BASE_URL}/document-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeData),
    })

    if (!res.ok) {
        throw new Error('Failed to create document type')
    }

    return res.json()
}
