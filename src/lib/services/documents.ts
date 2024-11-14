import { z } from "zod";
import { JoinedDocument } from "../dms/joined-docs";
import { doc_classification, doc_status } from "../dms/data";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const createEnumFromData = (data: Array<{ value: string }>) =>
    data.map(item => item.value) as [string, ...string[]];

const documentApiResponseSchema = z.object({
    document_id: z.string(),
    tracking_code: z.string(),
    document_code: z.string(),
    document_name: z.string(),
    classification: z.enum(createEnumFromData(doc_classification)),
    document_type: z.string(),
    originating_agency: z.string(),
    current_agency: z.string(),
    released_by: z.string().optional(),
    received_by: z.string().optional(),
    released_from: z.string().optional(),
    released_from_id: z.string().optional(),
    received_on_id: z.string().optional(),
    created_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    viewed_at: z.string().optional(),
    status: z.enum(createEnumFromData(doc_status))
});

type DocumentApiResponse = z.infer<typeof documentApiResponseSchema>;

export function useDocuments() {
    const { data: session } = useSession();
    const [documents, setDocuments] = useState<JoinedDocument[]>([]);

    useEffect(() => {
        const fetchDocs = async () => {
            if (!session?.user?.accessToken) {
                throw new Error("No active session");
            }

            const response = await fetch('https://ipophl.quanby-staging.com/api/documents', {
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = "/api/auth/signin";
                    throw new Error("Session expired");
                }
                throw new Error(`Failed to fetch documents: ${response.status}`);
            }

            const data: DocumentApiResponse[] = await response.json();
            return data.map(doc => ({
                id: doc.document_id,
                code: doc.tracking_code,
                title: doc.document_name,
                classification: doc.classification,
                type: doc.document_type,
                created_by: doc.created_by,
                date_created: doc.created_at,
                origin_office: doc.originating_agency,
                status: doc.status,
                released_by: doc.released_by,
                released_from: doc.released_from,
                receiving_office: doc.current_agency,
                is_received: !!doc.received_by,
                date_release: doc.updated_at,
                date_viewed: doc.viewed_at
            }));
        };

        fetchDocs();
    }, [session?.user?.accessToken]);

    return documents;
}