import { Metadata } from "next"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { DataTable } from "@/components/custom/documents/data-table"
import { columns } from "@/components/custom/documents/columns"
import { getCachedJoinedDocuments } from "@/lib/services/joined-documents/documents.server";

export const metadata: Metadata = {
    title: "DMS | Documents",
    description: "IPOPHIL Documents",
};

export const dynamic = 'force-dynamic' // Opt out of static rendering
export const revalidate = 3600 // Revalidate every hour

export default async function TaskPage() {
    try {
        const documents = await getCachedJoinedDocuments()

        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: "Documents", href: "/documents", active: true },
                    ]}
                />

                <div className="flex flex-1 flex-col gap-4 p-4">
                    <DataTable
                        data={documents}
                        columns={columns}
                        selection={false}
                    />
                </div>
            </>
        )
    } catch (error) {
        console.error('Error fetching documents:', error)
        // mar-note: Error UI here
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: "Documents", href: "/documents", active: true },
                    ]}
                />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <p className="text-red-500">Error loading documents. Please try again later.</p>
                </div>
            </>
        )
    }
}