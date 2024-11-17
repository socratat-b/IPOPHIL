'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { AddDocumentButton } from '../common/add-document/add-document-button'
import { doc_classification, doc_type_samples } from '@/lib/dms/data'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onAdd?: () => void
}

export function DataTableToolbar<TData>({ table, onAdd }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const formatLabel = (label: string) => label.replace(/[_-]/g, ' ')

    // Filter out the 'all' option from each array and ensure proper typing
    const filteredTypes = doc_type_samples.filter(type => type.value !== 'all')
    const filteredClassifications = doc_classification.filter(
        classification => classification.value !== 'all'
    )

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center space-x-2'>
                <Input
                    placeholder='Filter documents...'
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('title')?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                {table.getColumn('type') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('type')}
                        title='Types'
                        options={filteredTypes.map((type) => ({
                            value: type.value,
                            label: formatLabel(type.label),
                        }))}
                    />
                )}
                {table.getColumn('classification') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('classification')}
                        title='Classification'
                        options={filteredClassifications.map((classification) => ({
                            label: formatLabel(classification.label),
                            value: classification.value,
                        }))}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant={'ghost'}
                        onClick={() => table.resetColumnFilters()}
                        className='h-8 px-2 lg:px-3'
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <div className='flex items-center space-x-2'>
                <AddDocumentButton onAdd={onAdd} title='Receive' actionType={'Receive'} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
