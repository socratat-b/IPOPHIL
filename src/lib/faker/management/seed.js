"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var path_2 = require("path");
// Import data and types
var data_1 = require("./data");
// Get current file's directory
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_2.dirname)(__filename);
// Helper to generate UUID
var generateUUID = function () { return faker_1.faker.string.uuid(); };
// Helper to get enum value from data array
var getEnumValue = function (array) {
    return faker_1.faker.helpers.arrayElement(array).value;
};
// Generate Agencies
var generateAgencies = function (count) {
    if (count === void 0) { count = 10; }
    return Array.from({ length: count }, function () { return ({
        agency_id: generateUUID(),
        name: faker_1.faker.company.name(),
        code: faker_1.faker.string.alphanumeric(6).toUpperCase(),
        active: faker_1.faker.datatype.boolean(),
        created_by: generateUUID(),
        created_at: faker_1.faker.date.past().toISOString(),
        updated_at: faker_1.faker.date.recent().toISOString()
    }); });
};
// Generate Users
var generateUsers = function (agencies, count) {
    if (count === void 0) { count = 50; }
    return Array.from({ length: count }, function () { return ({
        user_id: generateUUID(),
        agency_id: faker_1.faker.helpers.arrayElement(agencies).agency_id,
        first_name: faker_1.faker.person.firstName(),
        last_name: faker_1.faker.person.lastName(),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
        role: getEnumValue(data_1.user_role),
        active: faker_1.faker.datatype.boolean(),
        created_at: faker_1.faker.date.past().toISOString(),
        updated_at: faker_1.faker.date.recent().toISOString()
    }); });
};
// Generate Document Details
var generateDocumentDetails = function (users, count) {
    if (count === void 0) { count = 200; }
    return Array.from({ length: count }, function () { return ({
        detail_id: generateUUID(),
        document_code: faker_1.faker.string.alphanumeric(10).toUpperCase(),
        document_name: faker_1.faker.lorem.sentence(4),
        classification: getEnumValue(data_1.doc_classification),
        type: getEnumValue(data_1.doc_type),
        created_by: faker_1.faker.helpers.arrayElement(users).user_id,
        created_at: faker_1.faker.date.past().toISOString(),
        updated_at: faker_1.faker.date.recent().toISOString()
    }); });
};
// Generate Documents
var generateDocuments = function (details, agencies, count) {
    if (count === void 0) { count = 150; }
    return Array.from({ length: count }, function () {
        var detail = faker_1.faker.helpers.arrayElement(details);
        var agency = faker_1.faker.helpers.arrayElement(agencies);
        return {
            document_id: generateUUID(),
            detail_id: detail.detail_id,
            tracking_code: faker_1.faker.string.alphanumeric(8).toUpperCase(),
            originating_agency_id: agency.agency_id,
            current_agency_id: faker_1.faker.helpers.arrayElement(agencies).agency_id,
            status: getEnumValue(data_1.doc_status),
            is_active: faker_1.faker.datatype.boolean(),
            archived_at: faker_1.faker.datatype.boolean() ? faker_1.faker.date.recent().toISOString() : null,
            created_at: faker_1.faker.date.past().toISOString(),
            updated_at: faker_1.faker.date.recent().toISOString()
        };
    });
};
// Generate Transit Status
var generateTransitStatus = function (documents, agencies, count) {
    if (count === void 0) { count = 300; }
    return Array.from({ length: count }, function () {
        var document = faker_1.faker.helpers.arrayElement(documents);
        var fromAgency = faker_1.faker.helpers.arrayElement(agencies);
        var toAgency;
        do {
            toAgency = faker_1.faker.helpers.arrayElement(agencies);
        } while (toAgency.agency_id === fromAgency.agency_id);
        return {
            transit_id: generateUUID(),
            document_id: document.document_id,
            status: getEnumValue(data_1.intransit_status),
            from_agency_id: fromAgency.agency_id,
            to_agency_id: toAgency.agency_id,
            initiated_at: faker_1.faker.date.past().toISOString(),
            completed_at: faker_1.faker.datatype.boolean() ? faker_1.faker.date.recent().toISOString() : null,
            active: faker_1.faker.datatype.boolean()
        };
    });
};
// Generate Document Logs
var generateDocumentLogs = function (documents, agencies, users, transitStatuses, count) {
    if (count === void 0) { count = 500; }
    return Array.from({ length: count }, function () { return ({
        log_id: generateUUID(),
        document_id: faker_1.faker.helpers.arrayElement(documents).document_id,
        transit_id: faker_1.faker.helpers.arrayElement(transitStatuses).transit_id,
        action: getEnumValue(data_1.log_action),
        from_agency_id: faker_1.faker.helpers.arrayElement(agencies).agency_id,
        to_agency_id: faker_1.faker.helpers.arrayElement(agencies).agency_id,
        performed_by: faker_1.faker.helpers.arrayElement(users).user_id,
        received_by: faker_1.faker.person.fullName(),
        remarks: faker_1.faker.lorem.sentence(),
        performed_at: faker_1.faker.date.recent().toISOString()
    }); });
};
// Generate and save data
var saveGeneratedData = function () {
    var agencies = generateAgencies(10);
    var users = generateUsers(agencies, 50);
    var documentDetails = generateDocumentDetails(users, 200);
    var documents = generateDocuments(documentDetails, agencies, 150);
    var transitStatus = generateTransitStatus(documents, agencies, 300);
    var documentLogs = generateDocumentLogs(documents, agencies, users, transitStatus, 500);
    var data = {
        agencies: agencies,
        users: users,
        documentDetails: documentDetails,
        documents: documents,
        transitStatus: transitStatus,
        documentLogs: documentLogs
    };
    Object.entries(data).forEach(function (_a) {
        var name = _a[0], items = _a[1];
        // Create the folder if it doesn't exist
        var folderPath = (0, path_1.join)(__dirname, '/data');
        (0, fs_1.mkdirSync)(folderPath, { recursive: true });
        // Write file to the folder
        (0, fs_1.writeFileSync)((0, path_1.join)(folderPath, "".concat(name, ".json")), JSON.stringify(items, null, 2));
        console.log("\u2705 ".concat(name, " data generated (").concat(items.length, " items)"));
    });
};
// Run the generator
saveGeneratedData();
