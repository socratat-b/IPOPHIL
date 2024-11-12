import { faker } from "@faker-js/faker";
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { z } from "zod";
import type {
    UserRole, LogAction, IntransitStatus,
    DocStatus, DocClassification, DocumentType,
    Agency, User, DocumentDetails, Document,
    DocumentTransitStatus, DocumentRouting, DocumentLogs,
    UserFeedback
} from './schema';
import {
    user_role, log_action, intransit_status,
    doc_status, doc_classification, doc_type_samples
} from './data';

const SEED_DATA_PATH = path.join(__dirname, 'data');
const generateUUID = () => faker.string.uuid();

// Track unique values
const usedTypeNames = new Set<string>();
const usedAgencyCodes = new Set<string>();
const usedEmails = new Set<string>();
const usedTrackingCodes = new Set<string>();
const usedDocumentCodes = new Set<string>();

// Helper to ensure Zod branded uniqueness
const ensureUnique = <T extends string>(
    value: T,
    usedValues: Set<string>,
    generator: () => T
): T & z.BRAND<"unique"> => {
    let current = value;
    while (usedValues.has(current)) {
        current = generator();
    }
    usedValues.add(current);
    return current as T & z.BRAND<"unique">;
};

const generateUniqueCode = (): string & z.BRAND<"unique"> => {
    return ensureUnique(
        faker.string.alphanumeric(10).toUpperCase(),
        usedAgencyCodes,
        () => faker.string.alphanumeric(10).toUpperCase()
    );
};

const generateUniqueDocumentCode = (): string & z.BRAND<"unique"> => {
    return ensureUnique(
        faker.string.alphanumeric(10).toUpperCase(),
        usedDocumentCodes,
        () => faker.string.alphanumeric(10).toUpperCase()
    );
};

const generateUniqueTrackingCode = (): string & z.BRAND<"unique"> => {
    return ensureUnique(
        faker.string.alphanumeric(8).toUpperCase(),
        usedTrackingCodes,
        () => faker.string.alphanumeric(8).toUpperCase()
    );
};

const generateUniqueEmail = (firstName: string, lastName: string): string & z.BRAND<"unique"> => {
    return ensureUnique(
        `${faker.internet.username({ firstName, lastName }).toLowerCase()}@example.com`.substring(0, 255),
        usedEmails,
        () => `${faker.internet.username()}@example.com`.substring(0, 255)
    );
};

const generateUniqueTypeName = (baseName: string): string & z.BRAND<"unique"> => {
    return ensureUnique(
        baseName.substring(0, 50),
        usedTypeNames,
        () => faker.company.name().substring(0, 50)
    );
};

// Generic helper to get random value from data array
const getRandomFromData = <T extends { value: string }>(dataArray: T[]): string => {
    return faker.helpers.arrayElement(dataArray).value;
};

// Generate Document Types
const generateDocumentTypes = (count = 10): DocumentType[] => {
    const sampleCount = Math.min(count, doc_type_samples.length);
    const selectedTypes = faker.helpers.shuffle([...doc_type_samples]).slice(0, sampleCount);

    return selectedTypes.map(typeObj => ({
        type_id: generateUUID(),
        name: generateUniqueTypeName(typeObj.value),
        description: typeObj.label ? `${typeObj.label} - ${faker.lorem.sentence()}` : null,
        active: faker.datatype.boolean(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));
};

const generateAgencies = (count = 10): Agency[] =>
    Array.from({ length: count }, () => ({
        agency_id: generateUUID(),
        name: faker.company.name(),
        code: generateUniqueCode(),
        active: faker.datatype.boolean(),
        created_by: generateUUID(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

const generateUsers = (agencies: Agency[], count = 50): User[] =>
    Array.from({ length: count }, () => {
        const firstName = faker.person.firstName().substring(0, 255);
        const lastName = faker.person.lastName().substring(0, 255);
        return {
            user_id: generateUUID(),
            agency_id: faker.helpers.arrayElement(agencies).agency_id,
            first_name: firstName,
            last_name: lastName,
            middle_name: faker.person.middleName()?.substring(0, 255) || null,
            user_name: faker.internet.username({ firstName, lastName }).substring(0, 255),
            email: generateUniqueEmail(firstName, lastName),
            role: getRandomFromData(user_role) as UserRole,
            title: faker.person.jobTitle().substring(0, 255),
            type: faker.person.jobType().substring(0, 255),
            avatar: faker.image.avatar(),
            active: faker.datatype.boolean(),
            created_at: faker.date.past().toISOString(),
            updated_at: faker.date.recent().toISOString()
        };
    });

const generateDocumentDetails = (users: User[], docTypes: DocumentType[], count = 200): DocumentDetails[] =>
    Array.from({ length: count }, () => ({
        detail_id: generateUUID(),
        document_code: generateUniqueDocumentCode(),
        document_name: faker.commerce.productName(),
        classification: getRandomFromData(doc_classification) as DocClassification,
        type_id: faker.helpers.arrayElement(docTypes).type_id,
        created_by: faker.helpers.arrayElement(users).user_id,
        removed_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

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
            status: getRandomFromData(doc_status) as DocStatus,
            is_active: faker.datatype.boolean(),
            viewed_at: faker.datatype.boolean() ?
                faker.date.between({ from: createdAt, to: new Date() }).toISOString() : null,
            created_at: createdAt,
            updated_at: faker.date.recent().toISOString()
        };
    });

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
            status: getRandomFromData(intransit_status) as IntransitStatus,
            from_agency_id: routing.from_agency_id,
            to_agency_id: routing.to_agency_id,
            initiated_at: initiatedAt,
            completed_at: faker.datatype.boolean() ?
                faker.date.between({ from: initiatedAt, to: new Date() }).toISOString() : null,
            active: faker.datatype.boolean()
        };
    });

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
            action: getRandomFromData(log_action) as LogAction,
            from_agency_id: transit.from_agency_id,
            to_agency_id: transit.to_agency_id,
            performed_by: faker.helpers.arrayElement(users).user_id,
            received_by: faker.datatype.boolean() ?
                faker.person.fullName().substring(0, 255) : null,
            remarks: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            performed_at: faker.date.between({
                from: transit.initiated_at,
                to: transit.completed_at || new Date()
            }).toISOString()
        };
    });

const generateUserFeedback = (users: User[], count = 50): UserFeedback[] =>
    Array.from({ length: count }, () => ({
        feedback_id: generateUUID(),
        user_id: faker.helpers.arrayElement(users).user_id,
        feedback_text: faker.lorem.paragraph(),
        created_at: faker.date.recent().toISOString()
    }));

const saveGeneratedData = () => {
    const documentTypes = generateDocumentTypes(10);
    const agencies = generateAgencies(10);
    const users = generateUsers(agencies, 50);
    const documentDetails = generateDocumentDetails(users, documentTypes, 200);
    const documents = generateDocuments(documentDetails, agencies, 150);
    const documentRouting = generateDocumentRouting(documents, agencies, 300);
    const transitStatus = generateTransitStatus(documents, documentRouting, 300);
    const documentLogs = generateDocumentLogs(documents, transitStatus, users, 500);
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

    mkdirSync(SEED_DATA_PATH, { recursive: true });

    Object.entries(data).forEach(([name, items]) => {
        writeFileSync(
            path.join(SEED_DATA_PATH, `${name}.json`),
            JSON.stringify(items, null, 2)
        );
        console.log(`✅ ${name} data generated (${items.length} items)`);
    });
};

saveGeneratedData();

/**
 * mar note:
 * 
 * > Compile the script with `tsc seed.ts`.
 * > Run the compiled script with `node seed`.
 * 
 * on the package json:
 * > now you can just run `pnpm seed:all` to generate the data
 */