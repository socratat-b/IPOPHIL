# Database Seeding Documentation

This documentation covers the database seeding functionality for the IPOPHIL Document Management System. The seeding system generates realistic test data for development and testing purposes.

## Table of Contents

- [Overview](#overview)
- [Data Structure](#data-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Overview

The seeding system generates the following types of data:

- Agencies
- Users
- Document Details
- Documents
- Document Transit Status
- Document Logs

All generated data follows predefined schemas and maintains referential integrity between entities.

## Data Structure

### Generated Entities

#### Agencies

```typescript
{
    agency_id: string;          // UUID
    name: string;              // Agency name
    code: string;              // 6-character alphanumeric code
    active: boolean;           // Activity status
    created_by: string;        // UUID of creator
    created_at: string;        // ISO date string
    updated_at: string;        // ISO date string
}
```

#### Users

```typescript
{
    user_id: string;           // UUID
    agency_id: string;         // Reference to agency
    first_name: string;
    last_name: string;
    email: string;
    role: "user" | "admin";
    title: string;
    type: string;
    active: boolean;
    created_at: string;        // ISO date string
    updated_at: string;        // ISO date string
}
```

#### Document Details

```typescript
{
    detail_id: string;         // UUID
    document_code: string;     // 10-character alphanumeric code
    document_name: string;
    classification: "simple" | "complex" | "highly_technical";
    type: "memo" | "letter" | "report" | "resolution" | "contract" | "request" | "proposal";
    created_by: string;        // Reference to user
    created_at: string;        // ISO date string
    updated_at: string;        // ISO date string
}
```

#### Documents

```typescript
{
    document_id: string;       // UUID
    detail_id: string;         // Reference to document details
    tracking_code: string;     // 8-character alphanumeric code
    originating_agency_id: string;  // Reference to agency
    current_agency_id: string;      // Reference to agency
    status: "dispatch" | "intransit" | "received" | "completed" | "canceled" | "archived";
    is_active: boolean;
    archived_at: string | null;     // ISO date string
    created_at: string;             // ISO date string
    updated_at: string;             // ISO date string
}
```

#### Transit Status

```typescript
{
    transit_id: string;        // UUID
    document_id: string;       // Reference to document
    status: "incoming" | "outgoing";
    from_agency_id: string;    // Reference to agency
    to_agency_id: string;      // Reference to agency
    initiated_at: string;      // ISO date string
    completed_at: string | null;    // ISO date string
    active: boolean;
}
```

#### Document Logs

```typescript
{
    log_id: string;           // UUID
    document_id: string;      // Reference to document
    transit_id: string;       // Reference to transit status
    action: "created" | "released" | "received" | "completed" | "returned";
    from_agency_id: string;   // Reference to agency
    to_agency_id: string;     // Reference to agency
    performed_by: string;     // Reference to user
    received_by: string;      // Name of receiver
    remarks: string;
    performed_at: string;     // ISO date string
}
```

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Ensure the following dependencies are in your `package.json`:

```json
{
  "dependencies": {
    "@faker-js/faker": "^9.1.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "tsconfig-paths": "^latest"
  }
}
```

## Usage

### Basic Usage

To generate seed data:

```bash
pnpm seed:all
```

This command:

1. Compiles the TypeScript seed script
2. Runs the compiled script
3. Generates JSON files in the `src/lib/faker/management/data` directory

### Generated Files

The script generates the following JSON files:

- `agencies.json`
- `users.json`
- `documentDetails.json`
- `documents.json`
- `transitStatus.json`
- `documentLogs.json`

### Default Generation Counts

- Agencies: 10
- Users: 50
- Document Details: 200
- Documents: 150
- Transit Status: 300
- Document Logs: 500

## Configuration

### TypeScript Configuration

The seeding system uses a separate TypeScript configuration file (`tsconfig.seed.json`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["src/lib/faker/management/seed.ts"],
  "exclude": ["node_modules"]
}
```

### NPM Scripts

Available scripts in `package.json`:

```json
{
  "scripts": {
    "generate:seed": "tsc --project tsconfig.seed.json",
    "seed": "node dist/lib/faker/management/seed.js",
    "seed:all": "pnpm generate:seed && pnpm seed"
  }
}
```

## Customization

### Modifying Generation Counts

Edit the counts in `saveGeneratedData` function in `seed.ts`:

```typescript
const saveGeneratedData = () => {
    const agencies = generateAgencies(10);        // Change count here
    const users = generateUsers(agencies, 50);    // Change count here
    const documentDetails = generateDocumentDetails(users, 200);  // Change count here
    // ... etc
};
```

### Adding New Data Types

1. Define the schema in `schema.ts`
2. Create enum values in `data.ts` if needed
3. Add a generator function in `seed.ts`
4. Add the generation to `saveGeneratedData()`

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**

   ```
   Error: Cannot find module '@/*'
   ```

   Solution: Ensure `tsconfig-paths` is properly configured

2. **Type Errors**

   ```
   Type 'string' is not assignable to type 'UserRole'
   ```

   Solution: Use proper type casting with enums

3. **Path Issues**

   ```
   Error: ENOENT: no such file or directory
   ```

   Solution: Check SEED_DATA_PATH configuration

### Debug Tips

1. Check generated files in `dist/` directory
2. Verify JSON output in `data/` directory
3. Use console.log for debugging generation process
