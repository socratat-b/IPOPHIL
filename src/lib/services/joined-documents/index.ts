// src/lib/services/documents.ts
import { cache } from 'react'
import { joinedDocumentSchema } from '@/lib/dms/joined-docs'

const REVALIDATE_TIME = 3600
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const getJoinedDocuments = cache(async () => {
    const res = await fetch(`${BASE_URL}/documents/joined`, {
        next: { revalidate: REVALIDATE_TIME }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch joined documents: ${res.statusText}`)
    }

    const data = await res.json()
    return joinedDocumentSchema.array().parse(data)
})