// src\lib\types\filter.ts
import type { DateRange } from 'react-day-picker'
import type { Document } from '@/lib/faker/documents/schema'
import { FileType } from '@/lib/controls'

export interface FilterValues {
    office: string
    classification: string
    type: string
    date: DateRange | undefined
    fileType: FileType
}

export interface FilterFormProps {
    values: FilterValues
    isDefaultDateRange: boolean
    onSubmit: (e: React.FormEvent) => void
    onOfficeChange: (value: string) => void
    onClassificationChange: (value: string) => void
    onTypeChange: (value: string) => void
    onDateSelect: (date: DateRange | undefined) => void
    onFileTypeChange: (value: FileType) => void
    onReset: () => void
}

export interface FilterSelectOption {
    value: string
    label: string
}

export interface FilterConfig {
    id: string
    label: string
    options: FilterSelectOption[]
    value: string
    onChange: (value: string) => void
}

export interface DataPreviewProps {
    filteredData: Document[]
    filters: FilterValues
    onItemClick: (item: Document) => void
}

export interface ReportGeneratorProps {
    data: Document[]
}