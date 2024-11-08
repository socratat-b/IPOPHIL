"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogs = exports.validateRouting = exports.validateTransitStatus = exports.validateDocument = exports.validateDocumentDetails = exports.validateUser = exports.validateAgency = exports.documentLogsSchema = exports.documentRoutingSchema = exports.documentTransitStatusSchema = exports.documentsSchema = exports.documentDetailsSchema = exports.userSchema = exports.agencySchema = exports.docClassificationEnum = exports.docTypeEnum = exports.docStatusEnum = exports.intransitStatusEnum = exports.logActionEnum = exports.userRoleEnum = void 0;
// src\lib\faker\management\schema.ts
var zod_1 = require("zod");
exports.userRoleEnum = zod_1.z.enum(["user", "admin"]);
exports.logActionEnum = zod_1.z.enum([
    "created",
    "released",
    "received",
    "completed",
    "returned"
]);
exports.intransitStatusEnum = zod_1.z.enum([
    "incoming",
    "outgoing"
]);
exports.docStatusEnum = zod_1.z.enum([
    "dispatch",
    "intransit",
    "received",
    "completed",
    "canceled",
    "archived"
]);
exports.docTypeEnum = zod_1.z.enum([
    "memo",
    "letter",
    "report",
    "resolution",
    "contract",
    "request",
    "proposal"
]);
exports.docClassificationEnum = zod_1.z.enum([
    "simple",
    "complex",
    "highly_technical"
]);
// Base schemas for common fields
var timestampFields = zod_1.z.object({
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime()
});
// Agency schema
exports.agencySchema = zod_1.z.object({
    agency_id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255),
    code: zod_1.z.string().min(1).max(10),
    active: zod_1.z.boolean().default(true),
    created_by: zod_1.z.string().uuid(),
}).merge(timestampFields);
// User schema
exports.userSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    agency_id: zod_1.z.string().uuid(),
    first_name: zod_1.z.string().min(1).max(255),
    last_name: zod_1.z.string().min(1).max(255),
    email: zod_1.z.string().email().max(255),
    password: zod_1.z.string().min(6).max(255),
    role: exports.userRoleEnum.default("user"),
    active: zod_1.z.boolean().default(true),
}).merge(timestampFields);
// Document Details schema
exports.documentDetailsSchema = zod_1.z.object({
    detail_id: zod_1.z.string().uuid(),
    document_code: zod_1.z.string().min(1).max(255),
    document_name: zod_1.z.string().min(1).max(255),
    classification: exports.docClassificationEnum,
    type: exports.docTypeEnum,
    created_by: zod_1.z.string().uuid(),
}).merge(timestampFields);
// Documents schema
exports.documentsSchema = zod_1.z.object({
    document_id: zod_1.z.string().uuid(),
    detail_id: zod_1.z.string().uuid(),
    tracking_code: zod_1.z.string().length(8).regex(/^[A-Z0-9]{8}$/),
    originating_agency_id: zod_1.z.string().uuid(),
    current_agency_id: zod_1.z.string().uuid(),
    status: exports.docStatusEnum.default("dispatch"),
    is_active: zod_1.z.boolean().default(true),
    archived_at: zod_1.z.string().datetime().nullable().optional(),
}).merge(timestampFields);
// Document Transit Status schema
exports.documentTransitStatusSchema = zod_1.z.object({
    transit_id: zod_1.z.string().uuid(),
    document_id: zod_1.z.string().uuid(),
    status: exports.intransitStatusEnum,
    from_agency_id: zod_1.z.string().uuid(),
    to_agency_id: zod_1.z.string().uuid(),
    initiated_at: zod_1.z.string().datetime(),
    completed_at: zod_1.z.string().datetime().nullable().optional(),
    active: zod_1.z.boolean().default(true),
});
// Document Routing schema
exports.documentRoutingSchema = zod_1.z.object({
    route_id: zod_1.z.string().uuid(),
    document_id: zod_1.z.string().uuid(),
    sequence_number: zod_1.z.number().int().positive(),
    from_agency_id: zod_1.z.string().uuid(),
    to_agency_id: zod_1.z.string().uuid(),
    expected_duration: zod_1.z.string().optional(), // For INTERVAL type
    is_required: zod_1.z.boolean().default(true),
    created_at: zod_1.z.string().datetime(),
});
// Document Logs schema
exports.documentLogsSchema = zod_1.z.object({
    log_id: zod_1.z.string().uuid(),
    document_id: zod_1.z.string().uuid(),
    transit_id: zod_1.z.string().uuid().nullable().optional(),
    action: exports.logActionEnum,
    from_agency_id: zod_1.z.string().uuid().nullable().optional(),
    to_agency_id: zod_1.z.string().uuid().nullable().optional(),
    performed_by: zod_1.z.string().uuid(),
    received_by: zod_1.z.string().max(255).nullable().optional(),
    remarks: zod_1.z.string().nullable().optional(),
    performed_at: zod_1.z.string().datetime(),
});
// Validation functions with proper input types
var validateAgency = function (input) { return exports.agencySchema.parse(__assign(__assign({}, input), { agency_id: crypto.randomUUID() })); };
exports.validateAgency = validateAgency;
var validateUser = function (input) { return exports.userSchema.parse(__assign(__assign({}, input), { user_id: crypto.randomUUID() })); };
exports.validateUser = validateUser;
var validateDocumentDetails = function (input) {
    return exports.documentDetailsSchema.parse(__assign(__assign({}, input), { detail_id: crypto.randomUUID() }));
};
exports.validateDocumentDetails = validateDocumentDetails;
var validateDocument = function (input) {
    return exports.documentsSchema.parse(__assign(__assign({}, input), { document_id: crypto.randomUUID() }));
};
exports.validateDocument = validateDocument;
var validateTransitStatus = function (input) {
    return exports.documentTransitStatusSchema.parse(__assign(__assign({}, input), { transit_id: crypto.randomUUID() }));
};
exports.validateTransitStatus = validateTransitStatus;
var validateRouting = function (input) {
    return exports.documentRoutingSchema.parse(__assign(__assign({}, input), { route_id: crypto.randomUUID() }));
};
exports.validateRouting = validateRouting;
var validateLogs = function (input) {
    return exports.documentLogsSchema.parse(__assign(__assign({}, input), { log_id: crypto.randomUUID() }));
};
exports.validateLogs = validateLogs;
