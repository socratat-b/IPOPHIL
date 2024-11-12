import { Metadata } from "next"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { DataTable } from "@/components/custom/documents/data-table"
import { columns } from "@/components/custom/documents/columns"
import { getJoinedDocuments } from "@/lib/services/documents";

export const metadata: Metadata = {
    title: "DMS | Documents",
    description: "IPOPHIL Documents",
};


export default async function TaskPage() {
    const documents = await getJoinedDocuments()

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
}