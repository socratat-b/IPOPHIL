'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useCompletedDocuments } from '@/lib/services/documents'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { columns } from '@/components/custom/completed-documents/columns'
import { DataTable } from '@/components/custom/completed-documents/data-table'

export default function DocumentsPage() {
    const { documents, error, isLoading } = useCompletedDocuments()

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents' },
                        { label: 'Completed', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <Skeleton className='h-[500px] w-full' />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents' },
                        { label: 'Completed', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <p className='text-red-500'>Error loading documents. Please try again later.</p>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Documents', href: '/documents' },
                    { label: 'Completed', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <DataTable
                    data={documents || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    )
}