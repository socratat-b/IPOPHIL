import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { documentsSchema } from '@/lib/faker/documents/schema';
import { compareDesc } from 'date-fns';

export async function GET() {
    try {
        // Read the documents.json file
        const data = await fs.readFile(
            path.join(process.cwd(), 'src/lib/faker/documents/documents.json')
        );

        // Parse the data using the documentsSchema
        const documents = documentsSchema.array().parse(JSON.parse(data.toString()));

        // mar-note: only fetch the documents that has status and not null, it means it is not archived (for now)

        // Sort the documents by date, latest to oldest
        const sortedDocuments = documents.sort((a, b) => {
            return compareDesc(new Date(a.date_created), new Date(b.date_created));
        });

        // Return the sorted documents as a JSON response
        return NextResponse.json(sortedDocuments);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
    }
}