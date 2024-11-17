// src\app\(auth)\reports\page.tsx
import path from "path"
import ReportGenerator from "@/components/custom/report-generator/report-generator"

import { z } from "zod"
import { Metadata } from 'next'
import { promises as fs } from "fs"
import { documentsSchema } from "@/lib/faker/documents/schema"
import { DashboardHeader } from "@/components/custom/dashboard/header"

export const metadata: Metadata = {
    title: 'DMS | Reports',
    description: 'IPOPHIL Documents',
}

async function getDocuments() {
    const data = await fs.readFile(
        path.join(process.cwd(), "src/lib/faker/documents/documents.json")
    );

    const tasks = JSON.parse(data.toString());

    return z.array(documentsSchema).parse(tasks);
}

export default async function Page() {
    const data = await getDocuments();

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Reports", href: "/reports", active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <ReportGenerator data={data} />
            </div>
        </>
    );
}
