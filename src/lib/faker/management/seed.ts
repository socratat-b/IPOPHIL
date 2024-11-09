import { faker } from "@faker-js/faker";
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
    user_role,
    log_action,
    intransit_status,
    doc_status,
    doc_type,
    doc_classification
} from './data';

// Use __dirname directly since we're in CommonJS
const SEED_DATA_PATH = join(__dirname, 'data');

// Helper to generate UUID
const generateUUID = () => faker.string.uuid();

// Helper to get enum value from data array
const getEnumValue = <T extends { value: string }>(array: T[]): string =>
    faker.helpers.arrayElement(array).value as string;

// Generate Agencies
const generateAgencies = (count = 10) =>
    Array.from({ length: count }, () => ({
        agency_id: generateUUID(),
        name: faker.company.name(),
        code: faker.string.alphanumeric(6).toUpperCase(),
        active: faker.datatype.boolean(),
        created_by: generateUUID(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

// Generate Users
const generateUsers = (agencies: any[], count = 50) =>
    Array.from({ length: count }, () => ({
        user_id: generateUUID(),
        agency_id: faker.helpers.arrayElement(agencies).agency_id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: getEnumValue(user_role),
        active: faker.datatype.boolean(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

// Generate Document Details
const generateDocumentDetails = (users: any[], count = 200) =>
    Array.from({ length: count }, () => ({
        detail_id: generateUUID(),
        document_code: faker.string.alphanumeric(10).toUpperCase(),
        document_name: faker.lorem.sentence(4),
        classification: getEnumValue(doc_classification),
        type: getEnumValue(doc_type),
        created_by: faker.helpers.arrayElement(users).user_id,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
    }));

// Generate Documents
const generateDocuments = (
    details: any[],
    agencies: any[],
    count = 150
) =>
    Array.from({ length: count }, () => {
        const detail = faker.helpers.arrayElement(details);
        const agency = faker.helpers.arrayElement(agencies);
        return {
            document_id: generateUUID(),
            detail_id: detail.detail_id,
            tracking_code: faker.string.alphanumeric(8).toUpperCase(),
            originating_agency_id: agency.agency_id,
            current_agency_id: faker.helpers.arrayElement(agencies).agency_id,
            status: getEnumValue(doc_status),
            is_active: faker.datatype.boolean(),
            archived_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
            created_at: faker.date.past().toISOString(),
            updated_at: faker.date.recent().toISOString()
        };
    });

// Generate Transit Status
const generateTransitStatus = (
    documents: any[],
    agencies: any[],
    count = 300
) =>
    Array.from({ length: count }, () => {
        const document = faker.helpers.arrayElement(documents);
        const fromAgency = faker.helpers.arrayElement(agencies);
        let toAgency;
        do {
            toAgency = faker.helpers.arrayElement(agencies);
        } while (toAgency.agency_id === fromAgency.agency_id);

        return {
            transit_id: generateUUID(),
            document_id: document.document_id,
            status: getEnumValue(intransit_status),
            from_agency_id: fromAgency.agency_id,
            to_agency_id: toAgency.agency_id,
            initiated_at: faker.date.past().toISOString(),
            completed_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
            active: faker.datatype.boolean()
        };
    });

// Generate Document Logs
const generateDocumentLogs = (
    documents: any[],
    agencies: any[],
    users: any[],
    transitStatuses: any[],
    count = 500
) =>
    Array.from({ length: count }, () => ({
        log_id: generateUUID(),
        document_id: faker.helpers.arrayElement(documents).document_id,
        transit_id: faker.helpers.arrayElement(transitStatuses).transit_id,
        action: getEnumValue(log_action),
        from_agency_id: faker.helpers.arrayElement(agencies).agency_id,
        to_agency_id: faker.helpers.arrayElement(agencies).agency_id,
        performed_by: faker.helpers.arrayElement(users).user_id,
        received_by: faker.person.fullName(),
        remarks: faker.lorem.sentence(),
        performed_at: faker.date.recent().toISOString()
    }));

// Generate and save data
const saveGeneratedData = () => {
    const agencies = generateAgencies(10);
    const users = generateUsers(agencies, 50);
    const documentDetails = generateDocumentDetails(users, 200);
    const documents = generateDocuments(documentDetails, agencies, 150);
    const transitStatus = generateTransitStatus(documents, agencies, 300);
    const documentLogs = generateDocumentLogs(
        documents,
        agencies,
        users,
        transitStatus,
        500
    );

    const data = {
        agencies,
        users,
        documentDetails,
        documents,
        transitStatus,
        documentLogs
    };

    // Create the folder if it doesn't exist
    mkdirSync(SEED_DATA_PATH, { recursive: true });

    Object.entries(data).forEach(([name, items]) => {
        writeFileSync(
            join(SEED_DATA_PATH, `${name}.json`),
            JSON.stringify(items, null, 2)
        );
        console.log(`✅ ${name} data generated (${items.length} items)`);
    });
};

// Run the generator
saveGeneratedData();