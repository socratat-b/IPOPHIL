'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentTypes } from '@/lib/services/document-types'
import { columns } from '@/components/custom/document-types/columns'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { DataTable } from '@/components/custom/document-types/data-table'

export default function DocumentsPage() {
    const { documentTypes, error, isLoading } = useDocumentTypes()

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Document Types', active: true },
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
                        { label: 'Document Types', active: true },

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
                    { label: 'Document Types', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <DataTable
                    data={documentTypes || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    )
}