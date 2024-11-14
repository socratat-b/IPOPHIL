import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { doc_type_samples, doc_status, doc_classification } from '@/lib/dms/data'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { ExportAllDocument } from './control/export-document'
import { AddDocumentButton } from '../common/add-document-button'
import { Icons } from '@/components/ui/icons'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onAdd?: () => void
}

export function DataTableToolbar<TData>({
    table,
    onAdd,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const formatLabel = (label: string) => label.replace(/[_-]/g, ' ')

    // Filter out the 'all' option from each array and ensure proper typing
    const filteredStatuses = doc_status.filter(status => status.value !== 'all')
    const filteredTypes = doc_type_samples.filter(type => type.value !== 'all')
    const filteredClassifications = doc_classification.filter(
        classification => classification.value !== 'all'
    )

    // Generic filter handler for any column
    const handleFilter = (columnId: string, value: unknown) => {
        table.getColumn(columnId)?.setFilterValue(value)
    }

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center space-x-2'>
                <div className='relative'>
                    <Icons.search className='absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <Input
                        placeholder='Search documents...'
                        value={(table.getColumn('document')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => handleFilter('document', event.target.value)}
                        className='h-8 w-[150px] lg:w-[250px] pl-10'
                    />
                </div>

                {table.getColumn('status') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('status')}
                        title='Status'
                        options={filteredStatuses.map((status) => ({
                            label: formatLabel(status.label),
                            value: status.value,
                            // icon: status.icon,
                        }))}
                    />
                )}
                {table.getColumn('type') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('type')}
                        title='Type'
                        options={filteredTypes.map((type) => ({
                            label: formatLabel(type.label),
                            value: type.value,
                            // icon: type.icon,
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
                <ExportAllDocument table={table} />
                <AddDocumentButton onAdd={onAdd} actionType='Create' />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}