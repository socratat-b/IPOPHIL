
// app/api/reports/csv/route.ts
import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

export async function POST(req: Request) {
    try {
        const { data, filename } = await req.json();

        // Convert data to CSV
        const csvContent = stringify(data, {
            header: true,
            columns: Object.keys(data[0]),
        });

        // Return response
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error generating CSV:', error);
        return NextResponse.json({ error: 'Failed to generate CSV file' }, { status: 500 });
    }
}