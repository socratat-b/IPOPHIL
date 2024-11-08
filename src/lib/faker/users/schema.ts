// src\lib\faker\users\schema.ts
import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    department_id: z.string(),
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    role: z.string(),
    title: z.string(),
    address: z.string(),
    status: z.string(),
    profile_url: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
