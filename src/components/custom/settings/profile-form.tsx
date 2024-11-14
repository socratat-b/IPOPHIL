'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Plus, LinkIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters.' })
        .max(30, { message: 'Username must not be longer than 30 characters.' }),
    email: z
        .string({ required_error: 'Please select an email to display.' })
        .email(),
    bio: z.string().max(160).min(4),
    urls: z
        .array(
            z.object({
                value: z.string().url({ message: 'Please enter a valid URL.' }),
            })
        )
        .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
    bio: 'I own a computer.',
    urls: [
        { value: 'https://meow-meow-meow.com' },
        { value: 'http://meow-meow-meow.com/meow' },
    ],
}

export function ProfileForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({
        name: 'urls',
        control: form.control,
    })

    async function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Profile updated successfully!', {
                description: 'Your changes have been saved.',
            })
        } catch (error) {
            toast.error('Failed to update profile', {
                description: 'Please try again later.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Username</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Username" 
                                        {...field} 
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    />
                                </FormControl>
                                <FormDescription className="text-sm">
                                    Your public display name. Limited to one change every 30 days.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Email</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                                            <SelectValue placeholder="Select verified email" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-sm">
                                    Manage emails in your{' '}
                                    <Link 
                                        href="/examples/forms" 
                                        className="text-primary hover:underline font-medium"
                                    >
                                        email settings
                                    </Link>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about yourself..."
                                        className="resize-none min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-sm">
                                    Use <span className="font-medium">@mentions</span> to link to users and organizations.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel className="text-base font-semibold">URLs</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ value: '' })}
                                className="flex items-center gap-2 hover:bg-primary/10"
                            >
                                <Plus className="h-4 w-4" />
                                Add URL
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <FormField
                                    control={form.control}
                                    key={field.id}
                                    name={`urls.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://example.com"
                                                            className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary"
                                                        />
                                                    </FormControl>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            className="min-w-[120px] bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}