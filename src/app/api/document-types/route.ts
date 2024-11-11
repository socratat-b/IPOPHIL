//src/app/api/document-types/routes.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { documentTypesSchema } from '@/lib/dms/schema';

export async function GET() {
    try {
        // Read the documents.json file
        const data = await fs.readFile(
            path.join(process.cwd(), 'dist/lib/dms/data/documentTypes.json')
        );

        // Parse the data using the documentsSchema
        const documents = documentTypesSchema.array().parse(JSON.parse(data.toString()));
 
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
    }
}