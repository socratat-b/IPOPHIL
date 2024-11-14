'use client'

import React from 'react'
import { format, startOfDay, endOfDay, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { Document } from '@/lib/faker/documents/schema'
import { FilterValues, ReportGeneratorProps } from '@/lib/types'
import { FileType, downloadFile, generatePDF } from '@/lib/controls'

import { DataPreview } from './data-preview'
import { DocumentDialog } from '../common/document-dialog'
import FilterForm from './filter-form'
import { Card } from '@/components/ui/card'

const defaultFilters = {
    office: 'all',
    classification: 'all',
    type: 'all',
    fileType: 'pdf' as FileType,
    date: undefined
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data }) => {
    const [selectedItem, setSelectedItem] = React.useState<Document | null>(null)
    const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false)
    const [filters, setFilters] = React.useState<FilterValues>(defaultFilters)

    const filteredData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return []
        return data.filter((item) => {
            try {
                const itemDate = parseISO(item.date_created)
                const dateMatch = !filters.date?.from || !filters.date?.to || (
                    itemDate >= startOfDay(filters.date.from) &&
                    itemDate <= endOfDay(filters.date.to)
                )
                const officeMatch = filters.office === 'all' || item.origin_office === filters.office
                const classificationMatch = filters.classification === 'all' || item.classification === filters.classification
                const typeMatch = filters.type === 'all' || item.type === filters.type
                return dateMatch && officeMatch && classificationMatch && typeMatch
            } catch (error) {
                console.error('Error processing item:', item, error)
                return false
            }
        })
    }, [data, filters])

    const formatData = (items: Document[]) => {
        return items.map(item => ({
            'Code': item.code,
            'Title': item.title,
            'Origin Office': item.origin_office,
            'Classification': item.classification,
            'Type': item.type,
            'Status': item.status,
            'Remarks': item.remarks || '',
            'Released By': item.released_by || '',
            'Released From': item.released_from || '',
            'Receiving Office': item.receiving_office || '',
            'Date Release': item.date_release ? format(parseISO(item.date_release), 'MM/dd/yyyy') : '',
        }))
    }

    const handleGenerateReport = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (filters.fileType === 'pdf') {
            generatePDF(filteredData, {
                orientation: 'landscape',
                title: 'IPOPHIL Document Report'
            })
            return
        }

        await downloadFile(formatData(filteredData), filters.fileType, 'Report')
    }

    const handleReset = () => setFilters(defaultFilters)

    const FilterContent = () => (
        <FilterForm
            values={filters}
            isDefaultDateRange={!filters.date}
            onSubmit={handleGenerateReport}
            onOfficeChange={(value: string) => {
                setFilters(prev => ({ ...prev, office: value }))
            }}
            onClassificationChange={(value: string) => {
                setFilters(prev => ({ ...prev, classification: value }))
            }}
            onTypeChange={(value: string) => {
                setFilters(prev => ({ ...prev, type: value }))
            }}
            onDateSelect={(date) => {
                setFilters(prev => ({ ...prev, date }))
            }}
            onFileTypeChange={(fileType: FileType) => {
                setFilters(prev => ({ ...prev, fileType }))
            }}
            onReset={handleReset}
        />
    )

    return (
        <div className='w-full space-y-4'>
            <div className='lg:hidden'>
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                    <SheetTrigger asChild>
                        <Button variant='outline' className='w-full'>
                            Filters & Print Options
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-full sm:max-w-lg'>
                        <div className='mt-4'>
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className='flex flex-col lg:flex-row w-full gap-6'>
                <div className='no-print hidden lg:block w-full max-w-sm'>
                    <FilterContent />
                </div>

                <div className='flex-1'>
                    <Card className='h-full rounded-md border'>
                        <DataPreview
                            filteredData={filteredData}
                            filters={filters}
                            onItemClick={setSelectedItem}
                        />
                    </Card>
                </div>
            </div>

            <DocumentDialog
                item={selectedItem}
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    )
}

export default ReportGenerator