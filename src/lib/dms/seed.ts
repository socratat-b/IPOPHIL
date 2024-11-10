// src\lib\faker\dms\seed.ts
import { faker } from "@faker-js/faker";
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import {
    type UserRole, type LogAction, type IntransitStatus,
    type DocStatus, type DocClassification, type DocumentType,
    type Agency, type User, type DocumentDetails, type Document,
    type DocumentTransitStatus, type DocumentRouting, type DocumentLogs,
    type UserFeedback,
    userRoleEnum, logActionEnum, intransitStatusEnum,
    docStatusEnum, docClassificationEnum
} from './schema';
import { doc_type_samples } from "./data";

// Use __dirname directly since we're in CommonJS
const SEED_DATA_PATH = path.join(__dirname, 'data');

// Helper to generate UUID
const generateUUID = () => faker.string.uuid();

// Create sets to track used values
const usedAgencyCodes = new Set<string>();
const usedDocumentCodes = new Set<string>();
const usedTrackingCodes = new Set<string>();
const usedEmails = new Set<string>();

// Helper to generate unique codes
const generateUniqueCode = (length: number, prefix = ''): string => {
    let code: string;
    do {
        code = `${prefix}${faker.string.alphanumeric(length).toUpperCase()}`;
    } while (usedAgencyCodes.has(code));
    usedAgencyCodes.add(code);
    return code;
};

const generateUniqueDocumentCode = (): string => {
    let code: string;
    do {
        code = `DOC-${faker.string.alphanumeric(7).toUpperCase()}`;
    } while (usedDocumentCodes.has(code));
    usedDocumentCodes.add(code);
    return code;
};

const generateUniqueTrackingCode = (): string => {
    let code: string;
    do {
        code = `TRK-${faker.string.alphanumeric(5).toUpperCase()}`;
    } while (usedTrackingCodes.has(code));
    usedTrackingCodes.add(code);
    return code;
};

const generateUniqueEmail = (firstName: string, lastName: string): string => {
    let email: string;
    do {
        const username = faker.internet.userName({ firstName, lastName }).toLowerCase();
        email = `${username}@example.com`;
    } while (usedEmails.has(email));
    usedEmails.add(email);
    return email;
};

// Updated type-safe helper functions for enum values
const getUserRole = (): UserRole =>
    faker.helpers.arrayElement(Object.values(userRoleEnum.enum));

const getDocStatus = (): DocStatus =>
    faker.helpers.arrayElement(Object.values(docStatusEnum.enum));

const getDocClassification = (): DocClassification =>
    faker.helpers.arrayElement(Object.values(docClassificationEnum.enum));

const getLogAction = (): LogAction =>
    faker.helpers.arrayElement(Object.values(logActionEnum.enum));

const getIntransitStatus = (): IntransitStatus =>
    faker.helpers.arrayElement(Object.values(intransitStatusEnum.enum));

// Generate Document Types
const generateDocumentTypes = (count = 10): DocumentType[] => {
    // Ensure we don't try to generate more types than we have samples
    const sampleCount = Math.min(count, doc_type_samples.length);

    // Randomly select unique samples from doc_type_samples
    const selectedTypes = faker.helpers.shuffle([...doc_type_samples]).slice(0, sampleCount);

    return selectedTypes.map(typeObj => ({
        type_id: generateUUID(),
        name: typeObj.value,
        description: `${typeObj.label} - ${faker.lorem.sentence()}`,
        active: faker.datatype.boolean(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));
};

// Generate Agencies
const generateAgencies = (count = 10): Agency[] =>
    Array.from({ length: count }, () => ({
        agency_id: generateUUID(),
        name: faker.company.name(),
        code: generateUniqueCode(6, 'AGY-'),
        active: faker.datatype.boolean(),
        created_by: generateUUID(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

// Generate Users
const generateUsers = (agencies: Agency[], count = 50): User[] =>
    Array.from({ length: count }, () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
            user_id: generateUUID(),
            agency_id: faker.helpers.arrayElement(agencies).agency_id,
            first_name: firstName,
            last_name: lastName,
            middle_name: faker.person.middleName(),
            user_name: faker.internet.userName({ firstName, lastName }).toLowerCase(),
            email: generateUniqueEmail(firstName, lastName),
            role: getUserRole(),
            title: faker.person.jobTitle(),
            type: faker.person.jobType(),
            avatar: faker.image.avatar(),
            active: faker.datatype.boolean(),
            created_at: faker.date.past().toISOString(),
            updated_at: faker.date.recent().toISOString()
        };
    });

// Generate Document Details
const generateDocumentDetails = (users: User[], docTypes: DocumentType[], count = 200): DocumentDetails[] =>
    Array.from({ length: count }, () => ({
        detail_id: generateUUID(),
        document_code: generateUniqueDocumentCode(),
        document_name: faker.lorem.sentence(4),
        classification: getDocClassification(),
        type_id: faker.helpers.arrayElement(docTypes).type_id,
        created_by: faker.helpers.arrayElement(users).user_id,
        removed_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : undefined,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

// Generate Documents
const generateDocuments = (
    details: DocumentDetails[],
    agencies: Agency[],
    count = 150
): Document[] =>
    Array.from({ length: count }, () => {
        const detail = faker.helpers.arrayElement(details);
        const agency = faker.helpers.arrayElement(agencies);
        const createdAt = faker.date.past().toISOString();

        return {
            document_id: generateUUID(),
            detail_id: detail.detail_id,
            tracking_code: generateUniqueTrackingCode(),
            originating_agency_id: agency.agency_id,
            current_agency_id: faker.helpers.arrayElement(agencies).agency_id,
            status: getDocStatus(),
            is_active: faker.datatype.boolean(),
            viewed_at: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
            created_at: createdAt,
            updated_at: faker.date.recent().toISOString()
        };
    });

// Generate Document Routing
const generateDocumentRouting = (
    documents: Document[],
    agencies: Agency[],
    count = 300
): DocumentRouting[] =>
    Array.from({ length: count }, (_, index) => {
        const document = faker.helpers.arrayElement(documents);
        const availableAgencies = agencies.filter(a => a.agency_id !== document.originating_agency_id);
        const sequence = Math.floor(index / documents.length) + 1;
        const prevAgency = sequence === 1 ?
            agencies.find(a => a.agency_id === document.originating_agency_id)! :
            faker.helpers.arrayElement(availableAgencies);
        const nextAgency = faker.helpers.arrayElement(
            availableAgencies.filter(a => a.agency_id !== prevAgency.agency_id)
        );

        return {
            route_id: generateUUID(),
            document_id: document.document_id,
            sequence_number: sequence,
            from_agency_id: prevAgency.agency_id,
            to_agency_id: nextAgency.agency_id,
            created_at: faker.date.past().toISOString()
        };
    });

// Generate Transit Status
const generateTransitStatus = (
    documents: Document[],
    routings: DocumentRouting[],
    count = 300
): DocumentTransitStatus[] =>
    Array.from({ length: count }, () => {
        const routing = faker.helpers.arrayElement(routings);
        const initiatedAt = faker.date.past().toISOString();

        return {
            transit_id: generateUUID(),
            document_id: routing.document_id,
            status: getIntransitStatus(),
            from_agency_id: routing.from_agency_id,
            to_agency_id: routing.to_agency_id,
            initiated_at: initiatedAt,
            completed_at: faker.datatype.boolean() ?
                faker.date.between({ from: initiatedAt, to: new Date() }).toISOString() :
                null,
            active: faker.datatype.boolean()
        };
    });

// Generate Document Logs
const generateDocumentLogs = (
    documents: Document[],
    transitStatuses: DocumentTransitStatus[],
    users: User[],
    count = 500
): DocumentLogs[] =>
    Array.from({ length: count }, () => {
        const transit = faker.helpers.arrayElement(transitStatuses);

        return {
            log_id: generateUUID(),
            document_id: transit.document_id,
            transit_id: transit.transit_id,
            action: getLogAction(),
            from_agency_id: transit.from_agency_id,
            to_agency_id: transit.to_agency_id,
            performed_by: faker.helpers.arrayElement(users).user_id,
            received_by: faker.person.fullName(),
            remarks: faker.lorem.sentence(),
            performed_at: faker.date.between({
                from: transit.initiated_at,
                to: transit.completed_at || new Date()
            }).toISOString()
        };
    });

// Generate User Feedback
const generateUserFeedback = (users: User[], count = 50): UserFeedback[] =>
    Array.from({ length: count }, () => {
        const createdAt = faker.date.recent().toISOString();
        return {
            feedback_id: generateUUID(),
            user_id: faker.helpers.arrayElement(users).user_id,
            feedback_text: faker.lorem.paragraph(),
            created_at: createdAt
        };
    });

// Generate and save data
const saveGeneratedData = () => {
    const documentTypes = generateDocumentTypes(10);
    const agencies = generateAgencies(10);
    const users = generateUsers(agencies, 50);
    const documentDetails = generateDocumentDetails(users, documentTypes, 200);
    const documents = generateDocuments(documentDetails, agencies, 150);
    const documentRouting = generateDocumentRouting(documents, agencies, 300);
    const transitStatus = generateTransitStatus(documents, documentRouting, 300);
    const documentLogs = generateDocumentLogs(
        documents,
        transitStatus,
        users,
        500
    );
    const userFeedback = generateUserFeedback(users, 50);

    const data = {
        documentTypes,
        agencies,
        users,
        documentDetails,
        documents,
        documentRouting,
        transitStatus,
        documentLogs,
        userFeedback
    };

    // Create the folder if it doesn't exist
    mkdirSync(SEED_DATA_PATH, { recursive: true });

    Object.entries(data).forEach(([name, items]) => {
        writeFileSync(
            path.join(SEED_DATA_PATH, `${name}.json`),
            JSON.stringify(items, null, 2)
        );
        console.log(`✅ ${name} data generated (${items.length} items)`);
    });
};

// Run the generator
saveGeneratedData();