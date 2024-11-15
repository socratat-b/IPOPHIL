'use client'

import { DashboardHeader } from '@/components/custom/dashboard/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOutgoingDocuments, useReceivedDocuments } from '@/lib/services/documents'
import { columns as incomingColumns } from '@/components/custom/incoming-documents/columns'
import { columns as outgoingColumns } from '@/components/custom/outgoing-documents/columns'
import { DataTable as OutgoingDataTable } from '@/components/custom/outgoing-documents/data-table'
import { DataTable as IncomingDataTable } from '@/components/custom/incoming-documents/data-table'

export default function DocumentsPage() {
    const { documents: outgoingDocuments, isLoading: outgoingLoading } = useOutgoingDocuments()
    const { documents: receivedDocuments, isLoading: receivedLoading } = useReceivedDocuments()

    if (outgoingLoading || receivedLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Documents', href: '/documents' },
                    { label: 'Intransit', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <Tabs defaultValue='outgoing' className='flex-1 flex flex-col'>
                    <TabsList className='grid grid-cols-2 w-max'>
                        <TabsTrigger value='outgoing'>Outgoing Documents</TabsTrigger>
                        <TabsTrigger value='incoming'>Incoming Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value='outgoing' className='mt-4'>
                        <OutgoingDataTable
                            data={outgoingDocuments || []}
                            columns={outgoingColumns}
                            selection={false}
                        />
                    </TabsContent>
                    <TabsContent value='incoming' className='mt-4'>
                        <IncomingDataTable
                            data={receivedDocuments || []}
                            columns={incomingColumns}
                            selection={true}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}