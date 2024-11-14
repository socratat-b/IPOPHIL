'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner' // Ensure 'sonner' is installed

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { documentsSchema, Document } from '@/lib/faker/documents/schema' // Import Document type
import { DocumentDialog } from '@/components/custom/common/document-dialog' // Assuming this component exists

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null) // Use Document | null as type
    const document = documentsSchema.parse(row.original)

    // Function to Copy ID
    const handleCopyID = () => {
        navigator.clipboard.writeText(document.id)
        toast.success('Document ID copied to clipboard')
    }

    // Function to view document
    const handleView = () => {
        setSelectedItem(document) // Set document to selectedItem, which now accepts Document type
    }

    // Function to edit document
    const handleEdit = () => {
        toast.info('Edit functionality coming soon')
    }

    // Function to release document
    const handleRelease = () => {
        toast.info('Release functionality coming soon')
    }

    // Function to delete document
    const handleDelete = () => {
        toast.error('Delete functionality coming soon')
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                    >
                        <DotsHorizontalIcon className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-[160px]'>

                    <DropdownMenuItem onClick={handleCopyID}>
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleView}>
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleEdit}>
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleRelease}>
                        Release
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleDelete}>
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {/* Document Dialog for viewing document details */}
            {selectedItem && (
                <DocumentDialog
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    )
}
