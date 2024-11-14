export interface ApiDocument {
    document_id: string
    tracking_code: string
    status: string
    document_code: string
    document_name: string
    classification: string
    document_type: string
    originating_agency: string
    current_agency: string
    released_by: string | null
    received_by: string | null
    released_from: string | null
    received_on: string | null
    released_from_id: string | null
    received_on_id: string | null
    created_by: string
    created_at: string
    updated_at: string
    viewed_at: string | null
}