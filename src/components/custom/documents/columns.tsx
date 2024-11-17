'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { classifications, statuses } from '@/lib/faker/documents/data'
import { Checkbox } from '@/components/ui/checkbox'
import { Document } from '@/lib/faker/documents/schema'
import DocumentCodeCell from '../common/code-cell/document-code-cell'
import { Icons } from '@/components/ui/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '../table/data-table-column-header'
import { formatBadgeText, formatBadgeTextAllCaps } from '@/lib/controls'

export const columns: ColumnDef<Document>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'print-code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Scan' />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <DocumentCodeCell code={data.code} />
        },
        enableSorting: false,
    },
    {
        id: 'document',
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Document' />
        ),
        cell: ({ row }) => {
            const data = row.original
            return (
                <div className='flex flex-col gap-1.5 py-1'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='flex flex-col'>
                                    <div className='font-medium'>
                                        {data.title}
                                    </div>
                                    <div className='flex items-center gap-1.5 mt-0.5'>
                                        <Icons.fileText className='h-3 w-3 text-blue-500' />
                                        <span className='text-sm text-muted-foreground'>
                                            {data.code}
                                        </span>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className='w-64'>
                                <div className='space-y-1.5'>
                                    <p>{data.title}</p>
                                    <p>ID: {data.id}</p>
                                    <p>Code: {data.code}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
        },
        filterFn: (row, id, filterValue) => {
            const searchTerm = (filterValue as string).toLowerCase()
            const document = row.original as Document

            return (
                document.id?.toLowerCase().includes(searchTerm) ||
                document.title?.toLowerCase().includes(searchTerm) ||
                document.code?.toLowerCase().includes(searchTerm) ||
                document.type?.toLowerCase().includes(searchTerm) ||
                document.classification?.toLowerCase().includes(searchTerm) ||
                document.created_by?.toLowerCase().includes(searchTerm) ||
                document.origin_office?.toLowerCase().includes(searchTerm) ||
                new Date(document.date_created).toLocaleDateString().toLowerCase().includes(searchTerm) ||
                document.status?.toLowerCase().includes(searchTerm)
            )
        },
    },
    {
        id: 'contact',
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Contact' />
        ),
        cell: ({ row }) => {
            const data = row.original
            return (
                <div className='flex flex-col gap-1.5'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className='flex items-center gap-1.5'>
                                <Icons.user className='w-3 h-3 text-violet-500' />
                                <span className='text-sm truncate max-w-[150px]'>
                                    {data.created_by}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{data.created_by}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className='flex items-center gap-1.5'>
                                <Icons.building className='w-3 h-3 text-emerald-500' />
                                <span className='text-sm text-muted-foreground truncate max-w-[150px]'>
                                    {formatBadgeText(data.origin_office)}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{formatBadgeText(data.origin_office)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Type' />
        ),
        cell: ({ row }) => {
            const type = row.original.type
            return (
                <span className='text-sm text-muted-foreground'>
                    {formatBadgeText(type)}
                </span>
            )
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return true
            const type = row.getValue(id) as string
            return Array.isArray(value) ? value.includes(type) : false
        },
    },
    {
        accessorKey: 'classification',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Classification' />
        ),
        cell: ({ row }) => {
            const classificationType = classifications.find(
                (cat) => cat.value === row.original.classification
            )
            return (
                <Badge
                    variant={classificationType?.value === 'confidential' ? 'destructive' : 'secondary'}
                    className='font-medium'
                >
                    {formatBadgeTextAllCaps(formatBadgeText(classificationType?.label || row.original.classification))}
                </Badge>
            )
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return true
            const classification = row.getValue(id) as string
            return Array.isArray(value) ? value.includes(classification) : false
        },
    },
    {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.original.status
            const statusType = statuses.find((s) => s.value === status)
            return (
                <div className='flex items-center gap-1.5'>
                    <div
                        className={`h-2 w-2 rounded-full ${status === 'active'
                            ? 'bg-emerald-500'
                            : 'bg-gray-300'
                            }`}
                    />
                    <span className={`text-sm ${status === 'active'
                        ? 'text-emerald-600'
                        : 'text-muted-foreground'
                        }`}>
                        {statusType?.label || status}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return true
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'dates',
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Activity' />
        ),
        cell: ({ row }) => {
            const data = row.original
            return (
                <div className='flex flex-col gap-1.5 text-sm'>
                    <div className='flex items-center gap-1.5'>
                        <Icons.calendar className='w-3 h-3 text-orange-500' />
                        <span className='text-muted-foreground'>
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium'
                            }).format(new Date(data.date_created))}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <Icons.refresh className='w-3 h-3 text-blue-500' />
                        <span className='text-muted-foreground'>
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium'
                            }).format(new Date(data.date_created))}
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
]