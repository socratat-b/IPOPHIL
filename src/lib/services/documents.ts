// src\lib\services\documents.ts
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { JoinedDocument, joinedDocumentSchema } from '@/lib/dms/joined-docs';
import { CreateDocumentData } from '@/lib/validations/documents/create_documents';

interface ApiDocument {
    document_id: string;
    tracking_code: string;
    status: string;
    document_code: string;
    document_name: string;
    classification: string;
    document_type: string;
    originating_agency: string;
    current_agency: string;
    released_by: string | null;
    received_by: string | null;
    released_from: string | null;
    received_on: string | null;
    released_from_id: string | null;
    received_on_id: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    viewed_at: string | null;
}

const transformDocument = (apiDoc: ApiDocument): JoinedDocument => {
    const transformed = {
        id: apiDoc.document_id,
        code: apiDoc.tracking_code,
        title: apiDoc.document_name,
        classification: apiDoc.classification as any,
        type: apiDoc.document_type,
        created_by: apiDoc.created_by,
        date_created: apiDoc.created_at,
        origin_office: apiDoc.originating_agency,
        status: apiDoc.status as any,
        remarks: '',
        released_by: apiDoc.released_by || undefined,
        released_from: apiDoc.released_from || undefined,
        receiving_office: apiDoc.current_agency,
        is_received: !!apiDoc.received_by,
        date_release: null,
        date_viewed: apiDoc.viewed_at
    };

    return joinedDocumentSchema.parse(transformed);
};

export function useDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch documents');
            }

            const data = await res.json() as ApiDocument[];
            return data.map(transformDocument);
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    /**
     * For Fixing
     */

    const createDocument = async (documentData: CreateDocumentData) => {
        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(documentData),
            });

            if (!res.ok) {
                throw new Error('Failed to create document');
            }

            const newDoc = await res.json();
            mutate();
            return newDoc;
        } catch (error) {
            throw error;
        }
    };

    return {
        documents: data,
        error,
        createDocument,
        isLoading: !data && !error,
    };
}