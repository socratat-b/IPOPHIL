import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { JoinedDocument, joinedDocumentSchema } from '@/lib/dms/joined-docs';
import { CreateDocumentData } from '@/lib/validations/documents/create_documents';
import { ApiDocument } from '@/lib/types';

const transformDocument = (apiDoc: ApiDocument): JoinedDocument => {
    const transformed = {
        id: apiDoc.document_id,
        code: apiDoc.tracking_code,
        title: apiDoc.document_name,
        classification: apiDoc.classification,
        type: apiDoc.document_type,
        created_by: apiDoc.created_by,
        date_created: apiDoc.created_at,
        origin_office: apiDoc.originating_agency,
        status: apiDoc.status,
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

export function useIncomingDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/incoming-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch incoming documents');
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

    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    };
}

export function useOutgoingDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/outgoing-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch outgoing documents');
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

    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    };
}

export function useReceivedDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/received-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch received documents');
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

    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    };
}