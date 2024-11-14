"use client"

import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { columns } from "@/components/custom/incoming-documents/columns"
import { DataTable } from "@/components/custom/incoming-documents/data-table"
import { useOutgoingDocuments, useReceivedDocuments } from "@/lib/services/documents"

export default function DocumentsPage() {
    const { documents: outgoingDocuments, isLoading: outgoingLoading } = useOutgoingDocuments()
    const { documents: receivedDocuments, isLoading: receivedLoading } = useReceivedDocuments()

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Documents", href: "/documents" },
                    { label: "Intransit", active: true },
                ]}
            />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Tabs defaultValue="outgoing" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-2 w-max">
                        <TabsTrigger value="outgoing">Outgoing Documents</TabsTrigger>
                        <TabsTrigger value="received">Received Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="outgoing" className="mt-4">
                        <DataTable
                            data={outgoingDocuments || []}
                            columns={columns}
                            selection={false}
                        />
                    </TabsContent>
                    <TabsContent value="received" className="mt-4">
                        <DataTable
                            data={receivedDocuments || []}
                            columns={columns}
                            selection={false}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}