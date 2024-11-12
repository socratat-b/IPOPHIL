// src\lib\faker\documents\schema.ts
import { z } from "zod";

export const documentsSchema = z.object({

    // for joining columns
    id: z.string(),
    code: z.string(),
    title: z.string(),
    classification: z.string(),
    type: z.string(),
    created_by: z.string(),
    date_created: z.string(),
    origin_office: z.string(),
    status: z.string(),
    remarks: z.string().optional(),
    released_by: z.string().optional(),
    released_from: z.string().optional(),
    receiving_office: z.string().optional(),
    date_release: z.string().nullable().optional(),
    date_viewed: z.string().nullable().optional(),
});

export type Document = z.infer<typeof documentsSchema>;
