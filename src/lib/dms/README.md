# Database Seeding Documentation

This documentation covers the database seeding functionality for the Document Management System. The seeding system generates realistic test data for development and testing purposes.

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

- Document Types
- Agencies
- Users
- Document Details
- Documents
- Document Routing
- Document Transit Status
- Document Logs
- User Feedback

All generated data follows predefined schemas using Zod for validation and maintains referential integrity between entities.

## Data Structure

### Enums

```typescript
// User Roles
enum user_role {
  user,    // Regular system user
  admin    // System administrator
}

// Log Actions
enum log_action {
  created,   // Document creation
  released,  // Document released to next agency
  received,  // Document received by agency
  completed, // Document processing completed
  returned   // Document returned to previous agency
}

// Transit Status
enum intransit_status {
  incoming,  // Document is incoming to agency
  outgoing,  // Document is outgoing from agency
  process    // Document is being processed
}

// Document Status
enum doc_status {
  dispatch,   // Initial dispatch status
  intransit,  // Document is in transit
  completed,  // Document processing completed
  canceled    // Document canceled/terminated
}

// Document Classification
enum doc_classification {
  simple,           // Basic documents
  complex,          // Documents requiring multiple reviews
  highly_technical  // Specialized technical documents
}
```

### Generated Entities

#### Document Types

```typescript
{
    type_id: string           // UUID
    name: string              // Unique document type name
    description: string       // Optional description
    active: boolean           // Activity status
    created_at: string        // ISO date string
    updated_at: string        // ISO date string
}
```

#### Agencies

```typescript
{
    agency_id: string         // UUID
    name: string             // Agency name
    code: string             // Unique 6-character code
    active: boolean          // Activity status
    created_by: string       // UUID of creator
    created_at: string       // ISO date string
    updated_at: string       // ISO date string
}
```

#### Users

```typescript
{
    user_id: string           // UUID
    agency_id: string         // Reference to agency
    first_name: string
    last_name: string
    middle_name?: string      // Optional
    user_name?: string        // Optional
    email: string             // Unique email
    role: user_role
    title?: string            // Optional
    type?: string             // Optional
    avatar?: string           // Optional
    active: boolean
    created_at: string
    updated_at: string
}
```

#### Document Details

```typescript
{
    detail_id: string         // UUID
    document_code: string     // Unique code
    document_name: string
    classification: doc_classification
    type_id: string          // Reference to document type
    created_by: string       // Reference to user
    archived_at?: string     // Optional ISO date
    created_at: string
    updated_at: string
}
```

#### Documents

```typescript
{
    document_id: string        // UUID
    detail_id: string         // Reference to document details
    tracking_code: string     // Unique 8-character code
    originating_agency_id: string
    current_agency_id: string
    status: doc_status
    is_active: boolean
    viewed_at: string
    created_at: string
    updated_at: string
}
```

#### Document Routing

```typescript
{
    route_id: string          // UUID
    document_id: string       // Reference to document
    sequence_number: number   // Positive integer
    from_agency_id: string    // Reference to agency
    to_agency_id: string      // Reference to agency
    created_at: string        // ISO date string
}
```

#### Transit Status

```typescript
{
    transit_id: string        // UUID
    document_id: string       // Reference to document
    status: intransit_status
    from_agency_id: string    // Reference to agency
    to_agency_id: string      // Reference to agency
    initiated_at: string      // ISO date string
    completed_at?: string     // Optional ISO date
    active: boolean
}
```

#### Document Logs

```typescript
{
    log_id: string            // UUID
    document_id: string       // Reference to document
    transit_id?: string       // Optional reference to transit
    action: log_action
    from_agency_id?: string   // Optional reference to agency
    to_agency_id?: string     // Optional reference to agency
    performed_by: string      // Reference to user
    received_by?: string      // Optional receiver name
    remarks?: string          // Optional remarks
    performed_at: string      // ISO date string
}
```

#### User Feedback

```typescript
{
    feedback_id: string       // UUID
    user_id: string          // Reference to user
    feedback_text: string     // Feedback content
    created_at: string       // ISO date string
}
```

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Required dependencies:

```json
{
  'dependencies': {
    '@faker-js/faker': '^8.0.0',
    'zod': '^3.21.4'
  },
  'devDependencies': {
    '@types/node': '^18.0.0',
    'typescript': '^5.0.0'
  }
}
```

## Usage

Generate seed data:

```bash
pnpm generate:seed
```

This command:

1. Compiles TypeScript using tsconfig.seed.json
2. Runs the compiled script
3. Generates JSON files in src/lib/faker/management/data/

### Generated Files

- documentTypes.json
- agencies.json
- users.json
- documentDetails.json
- documents.json
- documentRouting.json
- transitStatus.json
- documentLogs.json
- userFeedback.json

### Default Generation Counts

- Document Types: 10
- Agencies: 10
- Users: 50
- Document Details: 200
- Documents: 150
- Document Routing: 300
- Transit Status: 300
- Document Logs: 500
- User Feedback: 50

## Configuration

### TypeScript Configuration (tsconfig.seed.json)

```json
{
  'extends': './tsconfig.json',
  'compilerOptions': {
    'module': 'CommonJS',
    'outDir': 'dist/seed',
    'noEmit': false
  },
  'include': ['src/lib/faker/**/*.ts'],
  'exclude': ['node_modules', '**/*.test.ts']
}
```

## Customization

### Modifying Generation Counts

Edit the counts in saveGeneratedData:

```typescript
const saveGeneratedData = () => {
    const documentTypes = generateDocumentTypes(10)
    const agencies = generateAgencies(10)
    const users = generateUsers(agencies, 50)
    // ... etc
}
```

### Adding New Data Types

1. Define Zod schema in schema.ts
2. Create generator function in seed.ts
3. Add to saveGeneratedData()
4. Update reference handling if needed

## Troubleshooting

### Common Issues

1. **Path Resolution**

   ```
   Error: Cannot find module
   ```

   Solution: Check tsconfig paths and baseUrl

2. **Type Errors**

   ```
   Type ... is not assignable to type ...
   ```

   Solution: Verify Zod schema matches TypeScript types

3. **Data Generation**

   ```
   Error: Validation failed
   ```

   Solution: Check Zod schema constraints

### Debug Tips

1. Enable TypeScript strict mode
2. Use Zod's parse instead of safeParse
3. Check generated JSON for data integrity
4. Verify foreign key relationships
