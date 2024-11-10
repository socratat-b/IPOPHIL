// src/lib/faker/management/schema.ts

import { z } from "zod";

// Enums definition in Zod
export const userRoleEnum = z.enum(["user", "admin"]);
export const logActionEnum = z.enum([
    "created",
    "released",
    "received",
    "completed",
    "returned"
]);
export const intransitStatusEnum = z.enum([
    "incoming",
    "outgoing"
]);
export const docStatusEnum = z.enum([
    "dispatch",
    "intransit",
    "received",
    "completed",
    "canceled",
    "archived"
]);
export const docTypeEnum = z.enum([
    "memo",
    "letter",
    "report",
    "resolution",
    "contract",
    "request",
    "proposal"
]);
export const docClassificationEnum = z.enum([
    "simple",
    "complex",
    "highly_technical"
]);

// TypeScript types inferred from Zod schemas
export type UserRole = z.infer<typeof userRoleEnum>;
export type LogAction = z.infer<typeof logActionEnum>;
export type IntransitStatus = z.infer<typeof intransitStatusEnum>;
export type DocStatus = z.infer<typeof docStatusEnum>;
export type DocType = z.infer<typeof docTypeEnum>;
export type DocClassification = z.infer<typeof docClassificationEnum>;

// Base schema for common fields
const timestampFields = z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});

// Agency schema
export const agencySchema = z.object({
    agency_id: z.string().uuid(),
    name: z.string().min(1).max(255),
    code: z.string().min(1).max(10),
    active: z.boolean().default(true),
    created_by: z.string().uuid(),
}).merge(timestampFields);

export type Agency = z.infer<typeof agencySchema>;

// User schema
export const userSchema = z.object({
    user_id: z.string().uuid(),
    agency_id: z.string().uuid(),
    first_name: z.string().min(1).max(255),
    last_name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    role: userRoleEnum.default("user"),
    title: z.string().min(1).max(255),
    type: z.string().min(1).max(255),
    active: z.boolean().default(true),
}).merge(timestampFields);

export type User = z.infer<typeof userSchema>;

// Document Details schema
export const documentDetailsSchema = z.object({
    detail_id: z.string().uuid(),
    document_code: z.string().min(1).max(255),
    document_name: z.string().min(1).max(255),
    classification: docClassificationEnum,
    type: docTypeEnum,
    created_by: z.string().uuid(),
}).merge(timestampFields);

export type DocumentDetails = z.infer<typeof documentDetailsSchema>;

// Documents schema
export const documentsSchema = z.object({
    document_id: z.string().uuid(),
    detail_id: z.string().uuid(),
    tracking_code: z.string().length(8).regex(/^[A-Z0-9]{8}$/),
    originating_agency_id: z.string().uuid(),
    current_agency_id: z.string().uuid(),
    status: docStatusEnum.default("dispatch"),
    is_active: z.boolean().default(true),
    archived_at: z.string().datetime().nullable().optional(),
}).merge(timestampFields);

export type Document = z.infer<typeof documentsSchema>;

// Document Transit Status schema
export const documentTransitStatusSchema = z.object({
    transit_id: z.string().uuid(),
    document_id: z.string().uuid(),
    status: intransitStatusEnum,
    from_agency_id: z.string().uuid(),
    to_agency_id: z.string().uuid(),
    initiated_at: z.string().datetime(),
    completed_at: z.string().datetime().nullable().optional(),
    active: z.boolean().default(true),
});

export type DocumentTransitStatus = z.infer<typeof documentTransitStatusSchema>;

// Document Routing schema
export const documentRoutingSchema = z.object({
    route_id: z.string().uuid(),
    document_id: z.string().uuid(),
    sequence_number: z.number().int().positive(),
    from_agency_id: z.string().uuid(),
    to_agency_id: z.string().uuid(),
    created_at: z.string().datetime(),
});

export type DocumentRouting = z.infer<typeof documentRoutingSchema>;

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
    performed_at: z.string().datetime(),
});

export type DocumentLogs = z.infer<typeof documentLogsSchema>;

// Input types for validation functions
export type AgencyInput = Omit<Agency, 'agency_id'>;
export type UserInput = Omit<User, 'user_id'>;
export type DocumentDetailsInput = Omit<DocumentDetails, 'detail_id'>;
export type DocumentInput = Omit<Document, 'document_id'>;
export type TransitStatusInput = Omit<DocumentTransitStatus, 'transit_id'>;
export type RoutingInput = Omit<DocumentRouting, 'route_id'>;
export type LogsInput = Omit<DocumentLogs, 'log_id'>;

// Validation functions with proper input types
export const validateAgency = (input: AgencyInput): Agency =>
    agencySchema.parse({ ...input, agency_id: crypto.randomUUID() });

export const validateUser = (input: UserInput): User =>
    userSchema.parse({ ...input, user_id: crypto.randomUUID() });

export const validateDocumentDetails = (input: DocumentDetailsInput): DocumentDetails =>
    documentDetailsSchema.parse({ ...input, detail_id: crypto.randomUUID() });

export const validateDocument = (input: DocumentInput): Document =>
    documentsSchema.parse({ ...input, document_id: crypto.randomUUID() });

export const validateTransitStatus = (input: TransitStatusInput): DocumentTransitStatus =>
    documentTransitStatusSchema.parse({ ...input, transit_id: crypto.randomUUID() });

export const validateRouting = (input: RoutingInput): DocumentRouting =>
    documentRoutingSchema.parse({ ...input, route_id: crypto.randomUUID() });

export const validateLogs = (input: LogsInput): DocumentLogs =>
    documentLogsSchema.parse({ ...input, log_id: crypto.randomUUID() });