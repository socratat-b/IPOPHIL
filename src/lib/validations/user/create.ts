// src/lib/validations/user/create.ts
import { userRoleEnum } from '@/lib/dms/schema'
import { z } from 'zod'

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createUserSchema = z.object({
    agency_id: z.string()
        .min(1, "Please select an agency"),

    first_name: z.string()
        .min(1, "First name is required")
        .max(255, "First name must be less than 255 characters")
        .regex(/^[a-zA-Z\s-']+$/, "First name can only contain letters, spaces, hyphens and apostrophes"),

    last_name: z.string()
        .min(1, "Last name is required")
        .max(255, "Last name must be less than 255 characters")
        .regex(/^[a-zA-Z\s-']+$/, "Last name can only contain letters, spaces, hyphens and apostrophes"),

    middle_name: z.string()
        .max(255, "Middle name must be less than 255 characters")
        .regex(/^[a-zA-Z\s-']*$/, "Middle name can only contain letters, spaces, hyphens and apostrophes")
        .nullable()
        .optional(),

    email: z.string()
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters")
        .transform(email => email.toLowerCase()),

    role: userRoleEnum.default('user'),

    title: z.string()
        .min(1, "Job title is required")
        .max(255, "Job title must be less than 255 characters"),

    type: z.string()
        .min(1, "Job type is required")
        .max(255, "Job type must be less than 255 characters"),

    avatar: z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported"
        )
        .nullable()
        .optional(),
})

// Auto-generate username from email
export const generateUsername = (email: string): string => {
    return email.split('@')[0]
}

export type CreateUserData = z.infer<typeof createUserSchema>