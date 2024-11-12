// src/lib/services/documents.ts
import path from 'path'

import { z } from 'zod'
import { cache } from 'react'
import { promises as fs } from 'fs'
import { unstable_cache } from 'next/cache'
import { joinedDocumentSchema, JoinedDocument } from '@/lib/dms/joined-docs'
import { documentsSchema, documentDetailsSchema, documentLogsSchema, documentTransitStatusSchema, agencySchema, userSchema, documentTypesSchema } from '@/lib/dms/schema'

// File path constants to match seed script
const DATA_PATH = 'dist/lib/dms/data'
const FILE_PATHS = {
    documents: path.join(DATA_PATH, 'documents.json'),
    documentDetails: path.join(DATA_PATH, 'documentDetails.json'),
    documentLogs: path.join(DATA_PATH, 'documentLogs.json'),
    transitStatus: path.join(DATA_PATH, 'transitStatus.json'),
    agencies: path.join(DATA_PATH, 'agencies.json'),
    users: path.join(DATA_PATH, 'users.json'),
    documentTypes: path.join(DATA_PATH, 'documentTypes.json'),
}

// Helper function to load and validate file
const loadAndValidateFile = async <T>(
    filePath: string,
    schema: z.ZodType<T>,
    fileName: string
): Promise<T[]> => {
    try {
        const fullPath = path.join(process.cwd(), filePath)
        const data = await fs.readFile(fullPath, 'utf-8')
        return schema.array().parse(JSON.parse(data))
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error)
        if (error instanceof Error) {
            throw new Error(`Failed to load ${fileName}: ${error.message}`)
        }
        throw new Error(`Failed to load ${fileName}`)
    }
}

const getJoinedDocumentsFromDatabase = async () => {
    try {
        // Load all files with proper validation
        const [
            documents,
            details,
            logs,
            transits,
            agencies,
            users,
            types
        ] = await Promise.all([
            loadAndValidateFile(FILE_PATHS.documents, documentsSchema, 'documents'),
            loadAndValidateFile(FILE_PATHS.documentDetails, documentDetailsSchema, 'documentDetails'),
            loadAndValidateFile(FILE_PATHS.documentLogs, documentLogsSchema, 'documentLogs'),
            loadAndValidateFile(FILE_PATHS.transitStatus, documentTransitStatusSchema, 'transitStatus'),
            loadAndValidateFile(FILE_PATHS.agencies, agencySchema, 'agencies'),
            loadAndValidateFile(FILE_PATHS.users, userSchema, 'users'),
            loadAndValidateFile(FILE_PATHS.documentTypes, documentTypesSchema, 'documentTypes'),
        ])

        // Join and transform the data
        const joinedDocuments = documents.map(doc => {
            try {
                const detail = details.find(d => d.detail_id === doc.detail_id)
                if (!detail) return null

                const docType = types.find(t => t.type_id === detail.type_id)
                const originAgency = agencies.find(a => a.agency_id === doc.originating_agency_id)
                const creator = users.find(u => u.user_id === detail.created_by)

                const releaseLogs = logs
                    .filter(l => l.document_id === doc.document_id && l.action === 'released')
                    .sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime())
                const latestRelease = releaseLogs[0]

                const currentTransit = transits.find(
                    t => t.document_id === doc.document_id && t.active
                )

                const receivingAgency = currentTransit
                    ? agencies.find(a => a.agency_id === currentTransit.to_agency_id)
                    : null

                const releasingUser = latestRelease
                    ? users.find(u => u.user_id === latestRelease.performed_by)
                    : null

                const releasingAgency = latestRelease?.from_agency_id
                    ? agencies.find(a => a.agency_id === latestRelease.from_agency_id)
                    : null

                return joinedDocumentSchema.parse({
                    id: doc.document_id,
                    code: detail.document_code,
                    title: detail.document_name,
                    classification: detail.classification,
                    type: docType?.name ?? 'Unknown',
                    created_by: `${creator?.first_name ?? ''} ${creator?.last_name ?? ''}`.trim() || 'Unknown',
                    date_created: doc.created_at,
                    origin_office: originAgency?.name ?? 'Unknown',
                    status: doc.status,
                    remarks: latestRelease?.remarks,
                    released_by: releasingUser ? `${releasingUser.first_name} ${releasingUser.last_name}` : undefined,
                    released_from: releasingAgency?.name,
                    receiving_office: receivingAgency?.name,
                    date_release: latestRelease?.performed_at,
                    date_viewed: doc.viewed_at,
                })
            } catch (error) {
                console.error(`Error processing document ${doc.document_id}:`, error)
                return null
            }
        }).filter((doc): doc is JoinedDocument => doc !== null)

        return joinedDocuments
    } catch (error) {
        console.error('Database error:', error)
        throw new Error(`Failed to fetch joined documents from database: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// Cache configuration
const CACHE_TAG = 'joined-documents'
const REVALIDATE_TIME = 3600
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const getCachedJoinedDocuments = unstable_cache(
    getJoinedDocumentsFromDatabase,
    [CACHE_TAG],
    {
        revalidate: REVALIDATE_TIME,
        tags: [CACHE_TAG]
    }
)

export const getJoinedDocuments = cache(async () => {
    const res = await fetch(`${BASE_URL}/documents/joined`, {
        cache: 'force-cache',
        next: { revalidate: REVALIDATE_TIME }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch joined documents: ${res.statusText}`)
    }

    const data = await res.json()
    return joinedDocumentSchema.array().parse(data)
})

export const debugFileExists = async () => {
    const results = await Promise.all(
        Object.entries(FILE_PATHS).map(async ([name, filePath]) => {
            try {
                await fs.access(path.join(process.cwd(), filePath));
                return { name, exists: true };
            } catch {
                return { name, exists: false };
            }
        })
    );
    return results;
};