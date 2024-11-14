export enum DocumentStatus {
    Incoming = 'incoming',
    Received = 'recieved',
    Outgoing = 'outgoing',
    ForDispatch = 'for_dispatch',
    Completed = 'completed'
}

export interface StatusCounts {
    incoming: number
    recieved: number
    outgoing: number
    forDispatch: number
    completed: number
}

export interface Stats {
    current: StatusCounts
    percentageChanges: {
        incoming: number
        recieved: number
        outgoing: number
        completed: number
    }
}

export type DocumentClassification = 'hr' | 'marketing' | 'legal' | 'financial' | 'external' | 'internal' | 'confidential'
export type DocumentType = 'Meeting' | 'Document' | 'Email' | 'Report'
export type OfficeType = 'regional_office' | 'branch_office' | 'header_office'

export interface Document {
    id: string
    code: string
    title: string
    classification: DocumentClassification
    type: DocumentType
    created_by: string
    date_created: string
    origin_office: OfficeType
    status: DocumentStatus
    remarks: string
    released_by: string
    released_from: string
    receiving_office: string
    date_release: string | null
    date_viewed: string | null
}

export interface ChartDataPoint {
    value: number
    date?: string
}

export interface StatCardConfig {
    title: string
    key: keyof StatusCounts
    icon: React.ComponentType<{ className?: string }>
}

export type PercentageChange = {
    [K in keyof Omit<StatusCounts, 'forDispatch'>]: number
}

export interface StatusCounts {
    incoming: number
    recieved: number
    outgoing: number
    forDispatch: number
    completed: number
}

export interface Stats {
    current: StatusCounts
    percentageChanges: {
        incoming: number
        recieved: number
        outgoing: number
        completed: number
    }
}
