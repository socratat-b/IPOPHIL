'use client';

import { Suspense } from 'react';
import { DashboardHeader } from '@/components/custom/dashboard/header';
import { columns } from '@/components/custom/disptach-documents/columns';
import { DataTable } from '@/components/custom/disptach-documents/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatchDocuments } from '@/lib/services/documents';

const DocumentsPageContent = () => {
  const { documents, error, isLoading } = useDispatchDocuments();

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          breadcrumbs={[
            { label: 'Documents', href: '/documents' },
            { label: 'For Disptach', active: true },
          ]}
        />
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <Skeleton className='h-[500px] w-full' />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader
          breadcrumbs={[
            { label: 'Documents', href: '/documents' },
            { label: 'For Disptach', active: true },
          ]}
        />
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <p className='text-red-500'>
            Error loading documents. Please try again later.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Documents', href: '/documents' },
          { label: 'For Disptach', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <DataTable data={documents || []} columns={columns} selection={true} />
      </div>
    </>
  );
};

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentsPageContent />
    </Suspense>
  );
}
