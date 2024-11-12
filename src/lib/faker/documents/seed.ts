// src/lib/faker/data/seed.ts
import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";

import { classifications, types, origin_offices, statuses } from "./data";

// Filter out the "all" options only for faker data generation
const classificationsForFaker = classifications.filter(c => c.value !== "all");
const typesForFaker = types.filter(t => t.value !== "all");
const origin_officesForFaker = origin_offices.filter(o => o.value !== "all");
const statusesForFaker = statuses.filter(s => s.value !== "all");

const documents = Array.from({ length: 100 }, () => ({
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    code: faker.string.alphanumeric(10).toUpperCase(),
    title: faker.commerce.productName(),
    classification: faker.helpers.arrayElement(classificationsForFaker).value,
    type: faker.helpers.arrayElement(typesForFaker).value,
    created_by: `${faker.person.firstName()} ${faker.person.lastName()}`,
    date_created: faker.date.recent({ days: 30 }).toISOString(),
    origin_office: faker.helpers.arrayElement(origin_officesForFaker).value,
    status: faker.helpers.arrayElement(statusesForFaker).value,
    remarks: faker.lorem.sentence(),
    released_by: `${faker.person.firstName()} ${faker.person.lastName()}`,
    released_from: faker.company.name(),
    receiving_office: faker.company.name(),
    date_release: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
    date_viewed: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
}));

fs.writeFileSync(
    path.join(__dirname, "documents.json"),
    JSON.stringify(documents, null, 2)
);

console.log("✅ Documents data generated.");

/**
 * mar note:
 * 
 * > Compile the script with `tsc seed.ts`.
 * > Run the compiled script with `node seed`.
 * 
 * on the package json:
 * > now you can just run `pnpm seed:all` to generate the data
 */