// src/app/(auth)/type_doc/page.ts
import type { Metadata } from "next";
import { DashboardHeader } from "@/components/custom/dashboard/header";
import { columns } from "@/components/custom/document-types/columns";
import { DataTable } from "@/components/custom/document-types/data-table";

export const metadata: Metadata = {
    title: "DMS | Document Type",
    description: "IPOPHIL Document Types",
};

async function getDocumentTypes() {
    try {
        const response = await fetch('http://localhost:3000/api/document-types', {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error('Failed to fetch document types');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching document types:", error);
        return [];
    }
}

export default async function TaskPage() {
    const data = await getDocumentTypes();

    return (
        <>
            <DashboardHeader
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <DataTable
                    data={data}
                    columns={columns}
                    selection={false}
                />
            </div>
        </>
    );
}
