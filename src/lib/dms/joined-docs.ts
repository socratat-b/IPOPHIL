import { z } from "zod"
import { doc_classification, doc_status } from "./data"

// Helper to create enum from data array
const createEnumFromData = (data: Array<{ value: string }>) =>
    data.map(item => item.value) as [string, ...string[]]

export const joinedDocumentSchema = z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    classification: z.enum(createEnumFromData(doc_classification)),
    type: z.string(),
    created_by: z.string(),
    date_created: z.string(),
    origin_office: z.string(),
    status: z.enum(createEnumFromData(doc_status)),
    remarks: z.string().optional(),
    released_by: z.string().optional(),
    released_from: z.string().optional(),
    receiving_office: z.string().optional(),
    date_release: z.string().nullable().optional(),
    date_viewed: z.string().nullable().optional(),
})

export type JoinedDocument = z.infer<typeof joinedDocumentSchema>