'use client'

import { Metadata } from "next"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { DataTable } from "@/components/custom/documents/data-table"
import { columns } from "@/components/custom/documents/columns"
import { useDocuments } from "@/lib/services/documents"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsPage() {
    const { documents, error, isLoading } = useDocuments();

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: "Documents", href: "/documents", active: true },
                    ]}
                />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </>
        );
    }

    if (error) {
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
        );
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Documents", href: "/documents", active: true },
                ]}
            />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <DataTable
                    data={documents || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    );
}