'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { AddDocumentTypeButton } from './control/add-document-type-button'
import { useState, useCallback } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onAdd?: () => void
}

export function DataTableToolbar<TData>({ table, onAdd }: DataTableToolbarProps<TData>) {
    const [filterValue, setFilterValue] = useState(
        (table.getColumn('name')?.getFilterValue() as string) ?? ''
    )

    const isFiltered = table.getState().columnFilters.length > 0

    // Toggle active filter callback
    const setActiveFilter = useCallback((status: boolean | undefined) => {
        table.getColumn('active')?.setFilterValue(status)
    }, [table])

    // Update filter value for search input
    const handleFilterChange = useCallback((value: string) => {
        setFilterValue(value)
        table.getColumn('name')?.setFilterValue(value)
    }, [table])

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center space-x-2'>
                <Input
                    placeholder='Filter documents...'
                    value={filterValue}
                    onChange={(event) => handleFilterChange(event.target.value)}
                    className='h-8 w-[150px] lg:w-[250px]'
                />

                {/* Dropdown selection for Active status */}
                {table.getColumn('active') && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm' className='h-8'>
                                {table.getColumn('active')?.getFilterValue() === true
                                    ? 'Show Active'
                                    : table.getColumn('active')?.getFilterValue() === false
                                        ? 'Show Inactive'
                                        : 'Show All'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start'>
                            <DropdownMenuItem onClick={() => setActiveFilter(undefined)}>
                                Show All
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveFilter(true)}>
                                Show Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveFilter(false)}>
                                Show Inactive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {isFiltered && (
                    <Button
                        variant='ghost'
                        onClick={() => table.resetColumnFilters()}
                        className='h-8 px-2 lg:px-3'
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <div className='flex items-center space-x-2'>
                <AddDocumentTypeButton onAdd={onAdd} title='Add Type' actionType='Create' />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
