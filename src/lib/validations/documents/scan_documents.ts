import { z } from 'zod'

export const scanDocumentSchema = z.object({
    code: z.string().min(1, 'Document Code is required'),
})

export type ScanDocumentData = z.infer<typeof scanDocumentSchema>
