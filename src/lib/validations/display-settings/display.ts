import * as z from 'zod'

export const displayFormSchema = z.object({
    mainItems: z.array(z.string()),
    secondaryItems: z.array(z.string()),
    subItems: z.record(z.array(z.string())),
    showUserSection: z.boolean(),
})

export type DisplayFormValues = z.infer<typeof displayFormSchema>
