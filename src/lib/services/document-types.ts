import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { DocumentType } from '@/lib/dms/schema'

export function useDocumentTypes() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<DocumentType[]>(
        session?.user ? '/api/document-types' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch document types')
            }

            return res.json()
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documentTypes: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}