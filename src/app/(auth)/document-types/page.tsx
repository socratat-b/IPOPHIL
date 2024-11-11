// src/app/(auth)/type_doc/page.tsx
import type { Metadata } from "next"
import { getDocumentTypes } from '@/lib/services/document-types'
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { columns } from "@/components/custom/document-types/columns"
import { DataTable } from "@/components/custom/document-types/data-table"

export const metadata: Metadata = {
    title: "DMS | Document Type",
    description: "IPOPHIL Document Types",
}

export default async function DocumentTypesPage() {
    const documentTypes = await getDocumentTypes()

    return (
        <>
            <DashboardHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <DataTable
                    data={documentTypes}
                    columns={columns}
                    selection={false}
                />
            </div>
        </>
    )
}