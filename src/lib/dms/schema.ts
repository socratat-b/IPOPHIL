import { z } from "zod"

// Enums definition in Zod
export const userRoleEnum = z.enum([
    "user",             // Regular system user
    "admin"             // System administrator
])

export const logActionEnum = z.enum([
    "created",          // Document creation
    "released",         // Document released to next agency
    "received",         // Document received by agency
    "completed",        // Document processing completed
    "returned"          // Document returned to previous agency
])

export const intransitStatusEnum = z.enum([
    "incoming",         // Document is incoming to agency
    "outgoing",         // Document is outgoing from agency
    "process"           // Document is being processed
])

export const docStatusEnum = z.enum([
    "dispatch",         // Initial dispatch status
    "intransit",        // Document is in transit
    "completed",        // Document processing completed
    "canceled"          // Document canceled/terminated
])

export const docClassificationEnum = z.enum([
    "simple",           // Basic documents
    "complex",          // Documents requiring multiple reviews
    "highly_technical"  // Specialized technical documents
])

// TypeScript types inferred from Zod schemas
export type UserRole = z.infer<typeof userRoleEnum>
export type LogAction = z.infer<typeof logActionEnum>
export type IntransitStatus = z.infer<typeof intransitStatusEnum>
export type DocStatus = z.infer<typeof docStatusEnum>
export type DocClassification = z.infer<typeof docClassificationEnum>

// Base schema for common fields
const timestampFields = z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
})

// Document Types schema
export const documentTypesSchema = z.object({
    type_id: z.string().uuid(),
    name: z.string().min(1).max(50).brand('unique'),
    description: z.string().nullable().optional(),
    active: z.boolean().default(true),
}).merge(timestampFields)

export type DocumentType = z.infer<typeof documentTypesSchema>

// Agency schema
export const agencySchema = z.object({
    agency_id: z.string().uuid(),
    name: z.string().min(1).max(255),
    code: z.string().min(1).max(10).brand('unique'),
    active: z.boolean().default(true),
    created_by: z.string().uuid(),
}).merge(timestampFields)

export type Agency = z.infer<typeof agencySchema>

// User schema
export const userSchema = z.object({
    user_id: z.string().uuid(),
    agency_id: z.string().uuid(),
    first_name: z.string().min(1).max(255),
    last_name: z.string().min(1).max(255),
    middle_name: z.string().max(255).nullable().optional(),
    user_name: z.string().max(255).nullable().optional(),
    email: z.string().email().max(255).brand('unique'),
    role: userRoleEnum.default("user"),
    title: z.string().max(255).nullable().optional(),
    type: z.string().max(255).nullable().optional(),
    avatar: z.string().nullable().optional(),
    active: z.boolean().default(true),
}).merge(timestampFields)

// Extended user schema with nullable agency name
export const extendedUserSchema = userSchema.extend({
    agency_name: z.string().nullable(),
})

// Export types
export type User = z.infer<typeof userSchema>
export type ExtendedUser = z.infer<typeof extendedUserSchema>

// Document Details schema
export const documentDetailsSchema = z.object({
    detail_id: z.string().uuid(),
    document_code: z.string().min(1).max(255),
    document_name: z.string().min(1).max(255),
    classification: docClassificationEnum,
    type_id: z.string().uuid(),
    created_by: z.string().uuid(),
    removed_at: z.string().datetime().nullable().optional(),
}).merge(timestampFields)

export type DocumentDetails = z.infer<typeof documentDetailsSchema>

// Documents schema
export const documentsSchema = z.object({
    document_id: z.string().uuid(),
    detail_id: z.string().uuid(),
    tracking_code: z.string().length(8).nullable().brand('unique'),
    originating_agency_id: z.string().uuid(),
    current_agency_id: z.string().uuid(),
    status: docStatusEnum.default("dispatch"),
    is_active: z.boolean().default(true),
    viewed_at: z.string().datetime().nullable().optional(),
}).merge(timestampFields)

export type Document = z.infer<typeof documentsSchema>

// Document Transit Status schema
export const documentTransitStatusSchema = z.object({
    transit_id: z.string().uuid(),
    document_id: z.string().uuid(),
    status: intransitStatusEnum,
    from_agency_id: z.string().uuid(),
    to_agency_id: z.string().uuid(),
    initiated_at: z.string().datetime(),
    completed_at: z.string().datetime().nullable().optional(),
    active: z.boolean().default(true)
})

export type DocumentTransitStatus = z.infer<typeof documentTransitStatusSchema>

// Document Routing schema
export const documentRoutingSchema = z.object({
    route_id: z.string().uuid(),
    document_id: z.string().uuid(),
    sequence_number: z.number().int().positive(),
    from_agency_id: z.string().uuid(),
    to_agency_id: z.string().uuid(),
    created_at: z.string().datetime()
})

export type DocumentRouting = z.infer<typeof documentRoutingSchema>

// Document Logs schema
export const documentLogsSchema = z.object({
    log_id: z.string().uuid(),
    document_id: z.string().uuid(),
    transit_id: z.string().uuid().nullable().optional(),
    action: logActionEnum,
    from_agency_id: z.string().uuid().nullable().optional(),
    to_agency_id: z.string().uuid().nullable().optional(),
    performed_by: z.string().uuid(),
    received_by: z.string().max(255).nullable().optional(),
    remarks: z.string().nullable().optional(),
    performed_at: z.string().datetime()
})

export type DocumentLogs = z.infer<typeof documentLogsSchema>

// User Feedback schema
export const userFeedbackSchema = z.object({
    feedback_id: z.string().uuid(),
    user_id: z.string().uuid(),
    feedback_text: z.string(),
    created_at: z.string().datetime()
})

export type UserFeedback = z.infer<typeof userFeedbackSchema>

// Input types for validation functions
export type DocumentTypeInput = Omit<DocumentType, 'type_id' | 'created_at' | 'updated_at'>
export type AgencyInput = Omit<Agency, 'agency_id' | 'created_at' | 'updated_at'>
export type UserInput = Omit<User, 'user_id' | 'created_at' | 'updated_at'>
export type DocumentDetailsInput = Omit<DocumentDetails, 'detail_id' | 'created_at' | 'updated_at'>
export type DocumentInput = Omit<Document, 'document_id' | 'created_at' | 'updated_at'>
export type TransitStatusInput = Omit<DocumentTransitStatus, 'transit_id'>
export type RoutingInput = Omit<DocumentRouting, 'route_id'>
export type LogsInput = Omit<DocumentLogs, 'log_id'>
export type FeedbackInput = Omit<UserFeedback, 'feedback_id' | 'created_at'>

// Validation functions with proper input types
export const validateDocumentType = (input: DocumentTypeInput): DocumentType => {
    const now = new Date().toISOString()
    return documentTypesSchema.parse({
        ...input,
        type_id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
    })
}

export const validateAgency = (input: AgencyInput): Agency => {
    const now = new Date().toISOString()
    return agencySchema.parse({
        ...input,
        agency_id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
    })
}

export const validateUser = (input: UserInput): User => {
    const now = new Date().toISOString()
    return userSchema.parse({
        ...input,
        user_id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
    })
}

export const validateDocumentDetails = (input: DocumentDetailsInput): DocumentDetails => {
    const now = new Date().toISOString()
    return documentDetailsSchema.parse({
        ...input,
        detail_id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
    })
}

export const validateDocument = (input: DocumentInput): Document => {
    const now = new Date().toISOString()
    return documentsSchema.parse({
        ...input,
        document_id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
    })
}

export const validateTransitStatus = (input: TransitStatusInput): DocumentTransitStatus =>
    documentTransitStatusSchema.parse({
        ...input,
        transit_id: crypto.randomUUID()
    })

export const validateRouting = (input: RoutingInput): DocumentRouting =>
    documentRoutingSchema.parse({
        ...input,
        route_id: crypto.randomUUID()
    })

export const validateLogs = (input: LogsInput): DocumentLogs =>
    documentLogsSchema.parse({
        ...input,
        log_id: crypto.randomUUID()
    })

export const validateFeedback = (input: FeedbackInput): UserFeedback => {
    const now = new Date().toISOString()
    return userFeedbackSchema.parse({
        ...input,
        feedback_id: crypto.randomUUID(),
        created_at: now
    })
}