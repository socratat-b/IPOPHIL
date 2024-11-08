import { z } from "zod";

export const createDocumentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    classification: z.string().min(1, "Classification is required"),
    type: z.string().min(1, "Type is required"),
    attachments: z.any().optional(),
});